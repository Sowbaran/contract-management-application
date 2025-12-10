import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Types } from "mongoose";
import {
  DepartmentsRepository,
  RolesRepository,
  UsersRepository,
  FormModuleRepository,
} from "@app/common";
import {
  AdminRolesResponseDto,
  CreateUpdateUserResponseDto,
  CreateUsersDto,
  GetAllUsersResponseDto,
  GetUserByIdResponseDto,
  UserImpersonateResponseDto,
  UserMetaResponseDto,
} from "@src/users/dto";
import { ModuleCode, PermissionCodes, ROLECODES } from "../constants";
import { escapeRegExp } from "@src/utils";
import { HelperService } from "../helper/helper.service";
import { promises } from "dns";

interface Permission {
  moduleId: Types.ObjectId;
  moduleName: string;
  moduleCode: string;
  moduleStatus: boolean;
  permissionCode: string;
  status: boolean;
}

interface Role {
  _id: Types.ObjectId;
  name: string;
  code: string;
  status: boolean;
  permissions?: Permission[];
}

interface Module {
  _id: Types.ObjectId;
  name: string;
  code: string;
  status: boolean;
  permissions: string[];
}

interface User {
  name: string;
  email: string;
  departments: Department[];
}

interface Department {
  roles: Role[];
}

interface User {
  name: string;
  email: string;
  department: [];
  roles: Role[];
  status: boolean;
}

@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name);
  constructor(
    private usersRepo: UsersRepository,
    private rolesRepo: RolesRepository,
    private helperService: HelperService,
    private departmentsRepo: DepartmentsRepository,
    private formModuleRepository: FormModuleRepository,
  ) {}

  async createUser(
    createUsersDto: CreateUsersDto,
  ): Promise<CreateUpdateUserResponseDto> {
    const { email, departments, name, status, menuModuleId } = createUsersDto;
    await this.helperService.settingsPermissionCheck(
      createUsersDto.createdBy,
      menuModuleId,
      PermissionCodes.SETTINGS.VIEWUSERSETTINGS,
    );
    // Check if the user already exists
    const existingUser = await this.usersRepo.findOneExisting({ email });
    if (existingUser) {
      throw new ConflictException(
        `Email ${email} already exists for another user with status- ${existingUser.status}`,
      );
    }

    // Populate department and role details
    const populatedDepartments = await Promise.all(
      departments.map(async (department) => {
        // Fetch department details
        const departmentData = await this.departmentsRepo.findOne({
          _id: new Types.ObjectId(department._id),
        });
        if (!departmentData) {
          throw new NotFoundException(
            `Department with ID ${department._id} not found`,
          );
        }

        if (!department.roles || !Array.isArray(department.roles)) {
          throw new BadRequestException(
            `Roles are missing or invalid for department ${department._id}`,
          );
        }

        const populatedRoles = await Promise.all(
          department.roles.map(async (roleId) => {
            const roleData = await this.rolesRepo.findOne({
              _id: new Types.ObjectId(roleId), // Convert roleId to ObjectId
            });

            if (!roleData) {
              throw new NotFoundException(`Role with ID ${roleId} not found`);
            }

            return {
              _id: roleData._id,
              name: roleData.name,
              code: roleData.code,
              description: roleData.description,
              permissions: roleData.permissions,
              status: roleData.status,

              moduleId: roleData.moduleId,
            };
          }),
        );

        return {
          _id: departmentData._id,
          name: departmentData.name,
          roles: populatedRoles,
          code: departmentData.code,
        };
      }),
    );

    // Create the user with populated details
    const userToCreate = {
      name,
      email,
      departments: populatedDepartments,
      status: true,
      createdBy: createUsersDto.createdBy,
    };

    await this.usersRepo.create(userToCreate);
    return { message: "User has been created successfully" };
  }

  async getUserList(
    moduleId: string,
    emailId: string,
  ): Promise<AdminRolesResponseDto> {
    await this.helperService.settingsPermissionCheck(
      emailId,
      moduleId,
      PermissionCodes.SETTINGS.VIEWUSERSETTINGS,
    );
    const sortCriteria = { _id: -1 };
    const data = await this.usersRepo.find(
      {},
      {
        sort: sortCriteria,
      },
    );
    // Transform data to the required output structure
    const transformedData = data.map((user) => {
      const modules = new Set<string>();
      const permissions = new Set<string>();
      // Handle cases where user has no departments or departments is null/undefined
      const departments = (user.departments || []).map((department) => {
        // Extract roles for each department
        const roles = (department.roles || []).map((role) => {
          //role.moduleId?.forEach((module) => modules.add(module));
          // Handle cases where role has no permissions
          if (role.permissions && Array.isArray(role.permissions)) {
            role.permissions.forEach((permission) => {
              if (permission && permission.permissionCode)
              permissions.add(permission.permissionName);
              if (permission && permission.moduleCode) modules.add(permission.moduleName);
          });
          }

          return role.name; // Return role name
        });
        return {
          name: department.name || "",
          roles,
        };
      });

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        departments,
        modules: Array.from(modules), // Convert Set to Array
        permissions: Array.from(permissions), // Convert Set to Array
      };
    });

    return {
      message: "All Users data found successfully",
      data: transformedData,
      meta: {
        totalRowCount: transformedData.length,
      },
    };
  }

  async getUserDetail(
    id: string,
    moduleId: string,
    emailId: string,
  ): Promise<GetUserByIdResponseDto> {
    await this.helperService.settingsPermissionCheck(
      emailId,
      moduleId,
      PermissionCodes.SETTINGS.VIEWUSERSETTINGS,
    );
    const existingUsers = await this.usersRepo.findById(id);

    return {
      message: "User found successfully",
      data: existingUsers,
    };
  }

  async updateUser(
    id: string,
    updateUsersDto: CreateUsersDto,
  ): Promise<CreateUpdateUserResponseDto> {
    const { email, departments, name, status, updatedBy, menuModuleId } =
      updateUsersDto;
    await this.helperService.settingsPermissionCheck(
      updatedBy,
      menuModuleId,
      PermissionCodes.SETTINGS.VIEWUSERSETTINGS,
    );
    // Check if the user exists
    const existingUser = await this.usersRepo.findOneExisting({ _id: id });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If the email is changed, check if it's already in use
    if (existingUser.email !== email) {
      const emailExist = await this.usersRepo.findOneExisting({ email });
      if (emailExist) {
        throw new ConflictException(`Email ${email} already exists`);
      }
    }

    // Populate department and role details
    const populatedDepartments = await Promise.all(
      departments.map(async (department) => {
        // Fetch department details
        const departmentData = await this.departmentsRepo.findOne({
          _id: department._id,
        });
        if (!departmentData) {
          throw new NotFoundException(
            `Department with ID ${department._id} not found`,
          );
        }

        const populatedRoles = await Promise.all(
          department.roles.map(async (roleId) => {
            const roleData = await this.rolesRepo.findOne({
              _id: new Types.ObjectId(roleId), // Convert roleId to ObjectId
            });

            if (!roleData) {
              throw new NotFoundException(`Role with ID ${roleId} not found`);
            }

            return {
              _id: roleData._id,
              name: roleData.name,
              code: roleData.code,
              description: roleData.description,
              permissions: roleData.permissions,
              status: roleData.status,
              moduleId: roleData.moduleId,
            };
          }),
        );

        return {
          _id: departmentData._id,
          name: departmentData.name,
          roles: populatedRoles,
          code: departmentData.code,
        };
      }),
    );

    // Prepare the user object to update
    const userToUpdate = {
      name,
      email,
      departments: populatedDepartments,
      status: status ?? existingUser.status, // Keep the existing status if not provided
      updatedBy,
    };
    const query = { _id: id };
    const update = {
      $set: { ...userToUpdate },
    };

    // Update the user with the new data
    const updatedUser = await this.usersRepo.findOneAndUpdate(query, update);
    if (!updatedUser) {
      throw new NotFoundException(`Users #${id} not found`);
    }

    return { message: "User has been updated successfully" };
  }

  async deleteUserById(
    id: string,
    updatedBy: string,
  ): Promise<CreateUpdateUserResponseDto> {
    const query = { _id: id };
    const update = {
      $set: {
        status: false,
        updatedBy: updatedBy,
      },
    };
    const existingPermission = await this.usersRepo.findOneAndUpdate(
      query,
      update,
    );
    if (!existingPermission) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return {
      message: "User has been successfully deleted",
    };
  }

  async getAllUsers(): Promise<GetAllUsersResponseDto> {
    const data = await this.usersRepo.find(
      { status: true },
      { select: ["_id", "name"] },
    );
    return {
      message: "User data found",
      data,
    };
  }

  async getUserProfileDetail(
    emailId: string,
    guestName: string,
  ): Promise<UserMetaResponseDto> {
    const projection = "name email departments -_id";
    const existingUser = await this.usersRepo.findOneExisting(
      { email: emailId, status: true },
      projection,
    );

    // Check if user not found or departments are empty, if so, call getRoleMetaData
    if (
      !existingUser ||
      !existingUser.departments ||
      existingUser.departments.length === 0
    ) {
      return this.getRoleMetaData(emailId, guestName); // No departments found, fallback to default role
    }
    // Process the user departments to get roles and modules
    const { roles, modules } = await this.processUserDepartments(
      existingUser.departments,
      emailId, // Pass emailId for logging
    );
    const sortedModules = this.helperService.sortModules(modules);
    
    // Debug logging for specific user
    if (emailId === "test-schandolu@sstcspl.com") {
      this.logger.log(`User ${emailId} - Modules: ${JSON.stringify(sortedModules)}`);
      const contractModule = sortedModules.find(m => m.code === "contract");
      if (contractModule) {
        this.logger.log(`User ${emailId} - Contract Module Permissions: ${JSON.stringify(contractModule.permissions)}`);
      }
    }
    
    return {
      data: {
        username: existingUser.name ?? guestName,
        email: existingUser.email,
        roles,
        modules: sortedModules,
      },
    };
  }

  // Fetch and return the role and permissions for the guest user when no user is found
  async getRoleMetaData(emailId: string, guestName: string): Promise<UserMetaResponseDto> {
    const role = await this.rolesRepo.findOne({ code: ROLECODES.GUESTUSER });
    if (!role) {
      throw new Error("Role not found");
    }
    const formattedRoles = this.helperService.formatRoles([role]);
    const modulesMap = this.helperService.processRolePermissions(
      role.permissions,
    );
    return {
      data: {
        username: guestName,
        email: emailId,
        roles: formattedRoles,
        modules: Array.from(modulesMap.values()),
      },
    };
  }

  // Process and return roles and modules from the user's departments
  async processUserDepartments(departments: Department[], emailId?: string): Promise<{
    roles: Role[];
    modules: Module[];
  }> {
    const roles: Role[] = []; // Initialize roles array
    const modulesMap = new Map<string, Module>(); // To store modules with unique moduleIds
    const roleIdsSet = new Set<string>(); // To track unique role IDs

    // Collect all unique role IDs from departments
    departments.forEach((department) => {
      if (department.roles && Array.isArray(department.roles)) {
        department.roles.forEach((role) => {
          // Handle both role objects and role IDs
          const roleId = role._id || role;
          if (roleId) {
            const roleIdStr = roleId.toString();
            if (!roleIdsSet.has(roleIdStr)) {
              roleIdsSet.add(roleIdStr);
            }
          }
        });
      }
    });

    // Fetch fresh roles from database to get latest permissions
    // Fetch without status filter first to see if role exists, then filter by status when processing
    const freshRoles = await Promise.all(
      Array.from(roleIdsSet).map(async (roleIdStr) => {
        const freshRole = await this.rolesRepo.findOne({
          _id: new Types.ObjectId(roleIdStr),
        });
        return freshRole;
      }),
    );

    // Create a map of fresh roles by ID for quick lookup
    const freshRolesMap = new Map<string, typeof freshRoles[0]>();
    freshRoles.forEach((role) => {
      if (role) {
        freshRolesMap.set(role._id.toString(), role);
      }
    });

    // Iterate over departments and roles
    departments.forEach((department) => {
      if (department.roles && Array.isArray(department.roles)) {
      department.roles.forEach((role) => {
          // Handle both role objects and role IDs
          const roleId = role._id || role;
          if (!roleId) return;
          
          const roleIdStr = roleId.toString();
          const freshRole = freshRolesMap.get(roleIdStr);

          // Add the role if it's not already added (use fresh role data if available, otherwise embedded)
          if (freshRole) {
            if (!roles.some((r) => r._id.toString() === roleIdStr)) {
              roles.push({
                _id: freshRole._id,
                name: freshRole.name,
                code: freshRole.code,
                status: freshRole.status,
              });
            }
          } else if (role.name && !roles.some((r) => r._id.toString() === roleIdStr)) {
            // Fallback to embedded role data if fresh role not found
          roles.push({
              _id: role._id || new Types.ObjectId(roleIdStr),
            name: role.name,
            code: role.code,
            status: role.status,
          });
        }

          // Process permissions from fresh role (not embedded) - only if role is active
          if (freshRole && freshRole.status && freshRole.permissions) {
            // Debug logging for specific user
            if (emailId === "test-schandolu@sstcspl.com") {
              this.logger.log(`Processing role: ${freshRole.name} (${freshRole.code})`);
              this.logger.log(`Role permissions count: ${freshRole.permissions.length}`);
              freshRole.permissions.forEach((perm: any) => {
                this.logger.log(`Permission: ${perm.permissionCode}, status: ${perm.status}, moduleStatus: ${perm.moduleStatus}`);
              });
            }
          this.helperService.processRolePermissions(
              freshRole.permissions,
            modulesMap,
            ); // Update the modulesMap with permissions from fresh role
          } else if (freshRole && emailId === "test-schandolu@sstcspl.com") {
            this.logger.log(`Skipping role ${freshRole.name}: status=${freshRole.status}, hasPermissions=${!!freshRole.permissions}`);
        }
      });
      }
    });

    // Convert modulesMap to an array
    const modules = Array.from(modulesMap.values());
    return { roles, modules };
  }

  async impersonateUsersList(): Promise<UserImpersonateResponseDto> {
    const projection = "name email departments -_id";
    const usersData = await this.usersRepo.find(
      { status: true },
      {
        select: projection,
      },
    );
    // Transform the departments to match the expected output
    const transformedData = usersData
      .filter((user) => user.departments?.length > 0)
      .map((user) => {
        const transformedDepartments = user.departments
          .filter((dept) => dept.name) // Exclude departments without a name
          .map((dept) => {
            const deptName = dept.name || "";
            const roles = dept.roles?.map((role) => role.name).join(", ") || "";
            return roles ? `${deptName} - ${roles}` : `${deptName}`;
          });

        return {
          name: user.name,
          email: user.email,
          departments: transformedDepartments,
        };
      });

    // Add default "Requester" entry
    transformedData.push({
      name: "Requester",
      email: "guestuser@nrl.com.au",
      departments: ["Requestor - Guest user"],
    });
    transformedData.sort((a, b) => a.email.localeCompare(b.email));
    return { data: transformedData };
  }
}
