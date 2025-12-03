import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import {
  CreateDepartmentsDto,
  CreateUpdateDepartmentResponseDto,
  GetAllDepartmentResponseDto,
  GetAllDepartmentsWithRolesResponseDto,
  GetAllPerissionsAdminResponseDto,
  GetDepartmentByIdResponseDto,
  GetDepartmentResponseDto,
} from "@src/departments/dto";
import { DepartmentsRepository, RolesRepository } from "@app/common";
import { escapeRegExp } from "@src/utils";
import { plainToInstance } from "class-transformer";
import { Types } from "mongoose";
import { DEPARTMENTCODES, PermissionCodes, ROLECODES } from "@src/constants";
import { HelperService } from "@src/helper/helper.service";
import { Roles } from "@src/roles/roles.model";

@Injectable()
export class DepartmentsService {
  private logger: Logger;
  constructor(
    private departmentsRepo: DepartmentsRepository,
    private helperService: HelperService,
    private rolesRepo: RolesRepository,
  ) {
    this.logger = new Logger(DepartmentsService.name);
  }

  async createDepartment(
    createDepartmentsDto: CreateDepartmentsDto,
  ): Promise<CreateUpdateDepartmentResponseDto> {
    const { code, name, roles, menuModuleId } = createDepartmentsDto;
    await this.helperService.settingsPermissionCheck(
      createDepartmentsDto.createdBy,
      menuModuleId,
      PermissionCodes.SETTINGS.VIEWDEPARTMENTSETTINGS,
    );
    // Check if department with the given code or name already exists
    const existingDepartment = await this.departmentsRepo.findOneExisting({
      $or: [{ code: code?.toLowerCase() }, { name: name.toLowerCase() }],
    });

    // If department already exists, return an error response
    if (existingDepartment) {
      let message = "";
      if (existingDepartment.code === code) {
        message = `Department code '${code}' already exists in our database`;
      } else {
        message = `Department name '${name}' already exists in our database`;
      }
      this.logger.error(message);
      throw new ConflictException(message);
    }
    if (roles && roles.length > 0) {
      const sanitizedRoles = (roles || []).filter(
        (role) => role && Types.ObjectId.isValid(role),
      );
      createDepartmentsDto.roles = sanitizedRoles;
    }
    await this.departmentsRepo.create({
      ...createDepartmentsDto,
      code: createDepartmentsDto.code as string,
    });
    return { message: "Department has been created successfully" };
  }

  async getDepartmentList(
    moduleId: string,
    emailId: string,

    sortOrder?: boolean,
  ): Promise<GetAllPerissionsAdminResponseDto> {
    await this.helperService.settingsPermissionCheck(
      emailId,
      moduleId,
      PermissionCodes.SETTINGS.VIEWDEPARTMENTSETTINGS,
    );
    const sortCriteria = { _id: -1 };
    const data = await this.departmentsRepo.find(
      {},
      {
        populate: [
          { path: "moduleId", model: "FormModule", select: "name -_id" },
          { path: "roles", model: "Roles", select: "name -_id" },
        ],
        sort: sortCriteria,
      },
    );
    data.forEach((department) => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      department.roles = department.roles?.map((role: any) => role.name);
      department.moduleId = department.moduleId?.map(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (module: any) => module.name,
      );
    });

    const totalRowCount = data.length;
    const responseData = {
      message: "All Departments data found successfully",
      data,
      meta: {
        totalRowCount,
      },
    };

    const deptList = plainToInstance(
      GetAllPerissionsAdminResponseDto,
      responseData,
    );
    return deptList;
  }

  async getDepartmentDetail(
    id: string,
    moduleId: string,
    emailId: string,
  ): Promise<GetDepartmentByIdResponseDto | null> {
    await this.helperService.settingsPermissionCheck(
      emailId,
      moduleId,
      PermissionCodes.SETTINGS.VIEWDEPARTMENTSETTINGS,
    );
    const existingDepartments = await this.departmentsRepo.findById(id, {
      populate: [
        { path: "moduleId", model: "FormModule", select: "name" },
        { path: "roles", model: "Roles", select: "name" },
      ],
    });
    if (!existingDepartments) {
      throw new NotFoundException(`Department with ID ${id} not found.`);
    }
    type ModuleObject = {
      _id: string;
      name: string;
    };
    type RoleUnion = ModuleObject;
    type ModuleUnion = ModuleObject;

    const moduleIds = existingDepartments.moduleId as unknown as ModuleUnion[];
    const roleIds = existingDepartments.roles as unknown as RoleUnion[];

    const deptDetail = {
      _id: existingDepartments._id.toString(),
      name: existingDepartments.name,
      code: existingDepartments.code,
      description: existingDepartments.description,

      module: moduleIds.map((module) => {
        const _id = module._id.toString();
        const name = module.name;
        return { _id, name };
      }),

      roles: roleIds.map((role) => {
        const _id = role._id.toString();
        const name = role.name;
        return { _id, name };
      }),

      status: existingDepartments.status,
      createdBy: existingDepartments.createdBy,
      updatedBy: existingDepartments.updatedBy,
    };

    return { data: deptDetail };
  }

  async updateDepartment(
    id: string,
    updateDepartmentsDto: CreateDepartmentsDto,
  ): Promise<CreateUpdateDepartmentResponseDto> {
    const { name, roles, updatedBy, menuModuleId } = updateDepartmentsDto;
    await this.helperService.settingsPermissionCheck(
      updatedBy,
      menuModuleId,
      PermissionCodes.SETTINGS.VIEWDEPARTMENTSETTINGS,
    );
    if (name) {
      const existingDepartment = await this.departmentsRepo.findOneExisting({
        $or: [{ name: name.toLowerCase() }],
        _id: { $ne: id },
      });
      if (existingDepartment) {
        let message = "";
        message = `Department name '${name}' already exists in our database`;
        throw new ConflictException(message);
      }
      const departmentData = await this.departmentsRepo.findOne({ _id: id });
      updateDepartmentsDto.code = departmentData.code;
      if (roles && roles.length > 0) {
        const sanitizedRoles = (roles || []).filter(
          (role) => role && Types.ObjectId.isValid(role),
        );
        updateDepartmentsDto.roles = sanitizedRoles;
      }
      const query = { _id: id };
      const update = {
        $set: { ...updateDepartmentsDto },
      };
      // Pass the query and update objects to the repository's findOneAndUpdate method
      const existingDepartments = await this.departmentsRepo.findOneAndUpdate(
        query,
        update,
      );
      if (!existingDepartments) {
        this.logger.error(`Department not found ${id}`);
        throw new NotFoundException(`Department #${id} not found`);
      }

      if (existingDepartments && existingDepartments.status === false) {
        const deleteDeptsFromUsers =
          await this.helperService.RemoveDepartmentFromUser(id);
      } else {
        this.helperService.UpdateDepartmentInUsers(id, name,departmentData.code );
      }
    }
    return { message: "Department has been successfully updated" };
  }

  async deleteDepartmentById(
    id: string,
    updatedBy: string,
  ): Promise<CreateUpdateDepartmentResponseDto> {
    const query = { _id: id };
    const update = {
      $set: {
        status: false,
        updatedBy: updatedBy,
      },
    };
    const existingPermission = await this.departmentsRepo.findOneAndUpdate(
      query,
      update,
    );
    if (!existingPermission) {
      throw new NotFoundException(`Permission #${id} not found`);
    }
    const deleteDeptsFromUsers =
      await this.helperService.RemoveDepartmentFromUser(id);
    return {
      message: "Department has been successfully deleted",
    };
  }

  async getAllDepartments(): Promise<GetAllDepartmentResponseDto> {
    const data = await this.departmentsRepo.find(
      { status: true },
      { select: ["_id", "name"] },
    );
    return { message: "All Departments  data found successfully", data };
  }

  async getAllDepartmentsByModuleId(
    moduleId: string,
  ): Promise<GetAllDepartmentResponseDto> {
    const data = await this.departmentsRepo.find(
      {
        status: true,
        moduleId: new Types.ObjectId(moduleId),
        code: { $ne: DEPARTMENTCODES.CHIEF },
      },
      { select: ["_id", "name"] },
    );
    return { message: "All Departments  data found successfully", data };
  }

  async getAllDepartmentsWithRoles(): Promise<GetAllDepartmentsWithRolesResponseDto> {
    // Define allowed role codes for "chief" department
    const allowedRoleCodes = [
      ROLECODES.CFO,
      ROLECODES.CEO,
      ROLECODES.SUPERADMIN,
      ROLECODES.VENDORMODULEADMIN,
      ROLECODES.HEADCOUNTMODULEADMIN,
    ];
    // Fetch all departments
    const departments = await this.departmentsRepo.find(
      {status: true},
      { select: ["_id", "name", "roles", "code"] },
    );

    const allRoles = await this.rolesRepo.find(
      {status: true},
      { select: ["_id", "name", "code"] },
    );

    // Process departments and filter roles based on conditions
    const result = departments.map((dept) => {
      let roles: Roles[] = [];
      if (dept.code === DEPARTMENTCODES.CHIEF) {
        roles = allRoles.filter((role) => allowedRoleCodes.includes(role.code));
      } else {
        roles = allRoles.filter(
          (role) =>
            !allowedRoleCodes.includes(role.code) &&
            role.code !== ROLECODES.GUESTUSER,
        );
      }

      return {
        _id: dept._id.toString(),
        name: dept.name,
        roles: roles.map(
          (role: { _id: { toString: () => string }; name: string }) => ({
            _id: role._id.toString(),
            name: role.name,
          }),
        ),
      };
    });

    return {
      message: "All Departments  data found successfully",
      data: result,
    };
  }
}
