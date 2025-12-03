import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  AdminRolesResponseDto,
  ConfigurationResponseDto,
  CreateRolesDto,
  CreateUpdateRoleResponseDto,
  GetAllRolesResponseDto,
  GetRoleByIdResponseDto,
  RolesDto,
  RolesListDto,
} from "@src/roles/dto";
import { Roles } from "./roles.model";
import { FormModule } from "../form-module/form-module.model";
import {
  DepartmentsRepository,
  PermissionsRepository,
  RolesRepository,
} from "@app/common";
import { escapeRegExp } from "@src/utils";
import { stat } from "fs";
import { HelperService } from "@src/helper/helper.service";
import { DEPARTMENTCODES, PermissionCodes, ROLECODES } from "@src/constants";
import { status } from "migrate-mongo";

@Injectable()
export class RolesService {
  protected readonly logger = new Logger(RolesService.name);
  constructor(
    private rolesRepo: RolesRepository,
    private permissionsRepo: PermissionsRepository,
    private helperService: HelperService,
    private departmentRepo: DepartmentsRepository,
    @InjectModel("Roles") private RolesModel: Model<Roles>,
    @InjectModel("FormModule") private formModuleModel: Model<FormModule>,
  ) {}

  async createRole(
    createRolesDto: CreateRolesDto,
  ): Promise<CreateUpdateRoleResponseDto> {
    const { code, name, permissions, menuModuleId } = createRolesDto;
    await this.helperService.settingsPermissionCheck(
      createRolesDto.createdBy,
      menuModuleId,
      PermissionCodes.SETTINGS.VIEWROLESETTINGS,
    );
    const roleDetailsModels = await this.rolesRepo.findOneExisting({
      $or: [{ code: code?.toLowerCase() }, { name: name.toLowerCase() }],
    });

    if (roleDetailsModels) {
      let message = "";
      if (roleDetailsModels.code === code) {
        message = `Role code '${code}' already exists in our database`;
      } else {
        message = `Role name '${name}' already exists in our database`;
      }
      throw new ConflictException(message);
    }

    const permissionObjects = await Promise.all(
      permissions.map(async (permissionId) => {
        const permission = await this.permissionsRepo.findById(permissionId);
        if (!permission) {
          throw new NotFoundException(
            `Permission with ID '${permissionId}' not found`,
          );
        }

        const {
          _id,
          permissionName,
          permissionCode,
          moduleId,
          moduleCode,
          moduleName,
          moduleStatus,
          description,
          status,
        } = permission;
        return {
          _id,
          permissionName,
          permissionCode,
          moduleId,
          moduleCode,
          moduleName,
          moduleStatus,
          description,
          status,
        };
      }),
    );
    await this.rolesRepo.create({
      ...createRolesDto,
      code: createRolesDto.code as string,
      permissions: permissionObjects,
    });
    return { message: "Roles has been created successfully" };
  }

  async getRoleList(
    moduleId: string,
    emailId: string,
  ): Promise<AdminRolesResponseDto> {
    await this.helperService.settingsPermissionCheck(
      emailId,
      moduleId,
      PermissionCodes.SETTINGS.VIEWROLESETTINGS,
    );
    const sortCriteria = { _id: -1 };
    const data = await this.rolesRepo.find(
      {},
      {
        populate: {
          path: "moduleId", // Populate the role field in workflowOrder
          model: "FormModule", // Specify the model to populate from
          select: "name ", // Select the fields you want to retrieve (in this case, just the name)
        },
        sort: sortCriteria,
        
      },
    );
    data.forEach((department) => {
      department.moduleId = department.moduleId.map(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (module) => (module as any)?.name,
      );
    });

    const totalRowCount = data.length;
    return {
      message: "All Roles data found successfully",
      data,
      meta: {
        totalRowCount,
      },
    };
  }

  async getRoleDetail(
    id: string,
    moduleId: string,
    emailId: string,
  ): Promise<GetRoleByIdResponseDto> {
    await this.helperService.settingsPermissionCheck(
      emailId,
      moduleId,
      PermissionCodes.SETTINGS.VIEWROLESETTINGS,
    );

    interface FormModule {
      _id: Types.ObjectId;
      name: string;
    }

    interface Permission {
      _id: Types.ObjectId;
      permissionName: string;
      moduleId: FormModule;
    }

    interface RoleWithPopulatedModule {
      _id: Types.ObjectId;
      name: string;
      code: string;
      description?: string;
      status?: boolean;
      createdBy: string;
      updatedBy: string;
      moduleId: FormModule[]; // Populated
      permissions?: Permission[];
    }
    const roleData = (await this.rolesRepo.findById(id, {
      populate: [
        { path: "moduleId", model: "FormModule", select: "name" },
        { path: "permissions", model: "Permission" },
      ],
    })) as unknown as RoleWithPopulatedModule;

    if (!roleData) {
      throw new NotFoundException(`Department with ID ${id} not found.`);
    }

    const roleDetail = {
      _id: roleData._id,
      name: roleData.name,
      code: roleData.code,
      description: roleData.description || undefined,
      status: roleData.status !== undefined ? roleData.status : true,
      createdBy: roleData.createdBy,
      updatedBy: roleData.updatedBy,
      module: roleData.moduleId.map((module) => {
        const modulePermissions = (roleData.permissions || []).filter(
          (permission) =>
            permission.moduleId &&
            permission.moduleId._id.toString() === module._id.toString(),
        );

        return {
          _id: module._id,
          name: module.name,
          permissions: modulePermissions.map((permission) => ({
            _id: permission._id,
            name: permission.permissionName,
          })),
        };
      }),
    };

    return {
      message: "Role found successfully",
      data: roleDetail,
    };
  }

  async updateRole(
    id: string,
    updateRolesDto: CreateRolesDto,
  ): Promise<CreateUpdateRoleResponseDto> {
    const { name, permissions, status, updatedBy, menuModuleId } =
      updateRolesDto;

    await this.helperService.settingsPermissionCheck(
      updatedBy,
      menuModuleId,
      PermissionCodes.SETTINGS.VIEWROLESETTINGS,
    );
    if (name) {
      const existingRoles = await this.rolesRepo.findOneExisting({
        $or: [{ name: name.toLowerCase() }],
        _id: { $ne: id },
      });
      if (existingRoles) {
        let message = "";
        message = `Role name '${name}' already exists in our database`;
        throw new ConflictException(message);
      }
      const rolesData = await this.rolesRepo.findOne({ _id: id });
      updateRolesDto.code = rolesData.code;

      let permissionObjects = [];

      if (permissions && permissions.length > 0) {
        // If new permissions are provided, replace the current permissions
        permissionObjects = await Promise.all(
          permissions.map(async (permissionId) => {
            const permission =
              await this.permissionsRepo.findById(permissionId);
            if (!permission) {
              throw new NotFoundException(
                `Permission with ID '${permissionId}' not found`,
              );
            }

            // Return the necessary fields for the permission object
            const {
              _id,
              permissionName,
              permissionCode,
              moduleId,
              moduleCode,
              moduleName,
              moduleStatus,
              description,
              status,
            } = permission;

            return {
              _id,
              permissionName,
              permissionCode,
              moduleId,
              moduleCode,
              moduleName,
              moduleStatus,
              description,
              status,
            };
          }),
        );
      } else {
        // If no permissions are provided, fetch the current permissions of the role
        const roleData = await this.rolesRepo.findOne({ _id: id });
        permissionObjects = roleData.permissions; // Keep the current permissions
      }

      const query = { _id: id };
      const update = {
        $set: {
          ...updateRolesDto,
          permissions: permissionObjects,
        },
      };
      const isRoleAbsentInWorkflow =
        await this.helperService.CheckRoleInWorkflow(id);
      let existingRole: Roles;

      if (
        (isRoleAbsentInWorkflow && updateRolesDto.status === false) ||
        updateRolesDto.status === true
      ) {
        existingRole = await this.rolesRepo.findOneAndUpdate(query, update);
      } else {
        return {
          message: "Role cannot be deleted as it is available in the Workflow",
        };
      }
      if (!existingRole) {
        throw new NotFoundException(`Role #${id} not found`);
      }
      // const rolesArray = Array.isArray(existingRole) ? existingRole : [existingRole];
      // const updateResult =
      //   await this.helperService.UpdateRolesInOtherCollection(rolesArray);

      if (isRoleAbsentInWorkflow && updateRolesDto.status === false) {
        const rolesRemovedFromUsers =
          await this.helperService.RemoveRoleFromUser(id);
      } else {
        const updateResult = await this.helperService.UpdateRolesInUsers(
          id,
          existingRole,
        );

        const roleUpdateResult = await this.helperService.UpdateRoleInWorkFlow(
          id,
          existingRole.name,
        );
      }
    }
    return { message: "Roles has been successfully updated" };
  }

  async deleteRoleById(
    id: string,
    updatedBy: string,
  ): Promise<CreateUpdateRoleResponseDto> {
    const query = { _id: id };
    const update = {
      $set: {
        status: false,
        updatedBy: updatedBy,
      },
    };
    const isRoleAbsentInWorkflow =
      await this.helperService.CheckRoleInWorkflow(id);
    if (isRoleAbsentInWorkflow) {
      const existingPermission = await this.rolesRepo.findOneAndUpdate(
        query,
        update,
      );
      if (!existingPermission) {
        throw new NotFoundException(`Role #${id} not found`);
      }
      const rolesRemovedFromUsers =
        await this.helperService.RemoveRoleFromUser(id);
      return {
        message: "Role has been successfully deleted",
      };
    } else {
      return {
        message: "Role cannot be deleted as it is available in the Workflow",
      };
    }
  }

  async getConfigurationRoles(
    moduleId: string,
  ): Promise<ConfigurationResponseDto> {
    const data = await this.rolesRepo.find(
      { moduleId: { $in: moduleId }, status: true },
      {
        select: "name code ",
      },
    );
    return {
      message: "All Roles data found successfully",
      data: data,
    };
  }

  async getAllRoles(): Promise<GetAllRolesResponseDto> {
    const excludedRoleNames = ["Requester", "Super Admin", "Vendor Module Admin"];
    const data = await this.rolesRepo.find(
      { status: true ,name: { $nin: excludedRoleNames },},
      { select: ["_id", "name","code"] },
    );
    // data.forEach((role) => {
    //   role.moduleId = role.moduleId.map((module) => (module as any)?.name);
    // });
    return {
      message: "All Roles data found successfully",
      data,
    };
  }

  async getAllRolesByDeptId(id: string): Promise<GetAllRolesResponseDto> {
    const deptData = await this.departmentRepo.findById(id);

    if (!deptData) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    let data = await this.rolesRepo.find(
      { status: true },
      { select: ["_id", "name", "code"] },
    );

    // data.forEach((role) => {
    //   role.moduleId = role.moduleId.map((module) => (module as any)?.name);
    // });

    if (deptData.code === DEPARTMENTCODES.CHIEF) {
      const allowedRoleCodes = [
        ROLECODES.CFO,
        ROLECODES.CEO,
        ROLECODES.SUPERADMIN,
        ROLECODES.VENDORMODULEADMIN,
      ];
      data = data.filter((role) => allowedRoleCodes.includes(role.code));
    }

    data.push({
      _id: new Types.ObjectId(), // Generate a random ObjectId
      name: "headcount-module-admin",
      code: "headcount-module-admin",
      // Type cast to avoid TypeScript error
    } as Roles);
    return {
      message: "All Roles data found successfully",
      data,
    };
  }
}
