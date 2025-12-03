import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  CreatePermissionsDto,
  CreateUpdatePermissionResponseDto,
  GetAllPerissionsResponseDto,
  GetAllPermissionResponseDto,
  GetPerissionsDetailsResponseDto,
} from "@src/permissions/dto";
import { Permissions } from "./permissions.model";
import { Model } from "mongoose";
import {
  FormModuleRepository,
  PermissionsRepository,
  RolesRepository,
} from "@app/common";
import { escapeRegExp } from "@src/utils";
import { plainToInstance } from "class-transformer";
import { HelperService } from "@src/helper/helper.service";
import { PermissionCodes } from "@src/constants";

@Injectable()
export class PermissionsService {
  protected readonly logger = new Logger(PermissionsService.name);
  constructor(
    private permissionsRepo: PermissionsRepository,
    private formModuleRepo: FormModuleRepository,
    private helperService: HelperService,
    private rolesRepo: RolesRepository,
    @InjectModel("Permissions") private permissionsModel: Model<Permissions>,
  ) {}

  async createPermissions(
    createPermissionsDto: CreatePermissionsDto,
  ): Promise<CreateUpdatePermissionResponseDto> {
    const { permissionCode, permissionName, menuModuleId } =
      createPermissionsDto;
    await this.helperService.settingsPermissionCheck(
      createPermissionsDto.createdBy,
      menuModuleId,
      PermissionCodes.SETTINGS.VIEWPERMISSIONSETTINGS,
    );
    const existingPermission = await this.permissionsRepo.findOneExisting({
      $or: [
        { permissionCode: permissionCode },
        { permissionName: permissionName },
      ],
    });

    if (existingPermission) {
      let message = "";
      if (existingPermission.permissionCode === permissionCode) {
        message = `The combination of selected permission values already exists in our database. Please try another combination.`;
      } else {
        message = `Permission name '${permissionName}' already exists in our database`;
      }
      throw new ConflictException(message);
    }
    const moduleData = await this.formModuleRepo.findById(
      createPermissionsDto.moduleId,
    );
    createPermissionsDto.moduleCode = moduleData?.code as string;
    createPermissionsDto.moduleName = moduleData?.name as string;
    createPermissionsDto.moduleStatus = moduleData?.status as boolean;
    await this.permissionsRepo.create({
      ...createPermissionsDto,
      permissionCode: createPermissionsDto.permissionCode as string,
    });
    return { message: "The Permission has been successfully created." };
  }

  async getPermissionList(
    moduleId: string,
    emailId: string,
  ): Promise<GetAllPerissionsResponseDto> {
    await this.helperService.settingsPermissionCheck(
      emailId,
      moduleId,
      PermissionCodes.SETTINGS.VIEWPERMISSIONSETTINGS,
    );

    const sortCriteria = { _id: -1 };
    const data = await this.permissionsRepo.find(
      {},
      {
        sort: sortCriteria,
      },
    );
    const totalRowCount = data.length;
    const resData = {
      data,
      meta: {
        totalRowCount,
      },
    };
    return plainToInstance(GetAllPerissionsResponseDto, resData);
  }

  async getPermissionDetail(
    id: string,
    moduleId: string,
    emailId: string,
  ): Promise<GetPerissionsDetailsResponseDto | null> {
    await this.helperService.settingsPermissionCheck(
      emailId,
      moduleId,
      PermissionCodes.SETTINGS.VIEWPERMISSIONSETTINGS,
    );
    const resData = await this.permissionsRepo.findById(id);
    return plainToInstance(GetPerissionsDetailsResponseDto, resData);
  }

  async updatePermission(
    id: string,
    updatePermissionsDto: CreatePermissionsDto,
  ): Promise<CreateUpdatePermissionResponseDto> {
    const { permissionName, updatedBy, menuModuleId } = updatePermissionsDto;
    await this.helperService.settingsPermissionCheck(
      updatedBy,
      menuModuleId,
      PermissionCodes.SETTINGS.VIEWPERMISSIONSETTINGS,
    );
    const existingPermission = await this.permissionsRepo.findOneExisting({
      permissionName: permissionName,
      _id: { $ne: id },
    });
    if (existingPermission) {
      let message = "";
      if (existingPermission.permissionName === permissionName) {
        message = `The combination of selected permission values already exists in our database. Please try another combination.`;
      }
      throw new ConflictException(message);
    }

    const permissionData = await this.permissionsRepo.findOne({ _id: id });
    updatePermissionsDto.permissionCode = permissionData.permissionCode;

    if (!updatePermissionsDto.moduleId) {
      throw new BadRequestException("moduleId is required.");
    }

    const moduleData = await this.formModuleRepo.findById(
      updatePermissionsDto.moduleId,
    );

    if (!moduleData) {
      throw new NotFoundException(
        `Module with ID '${updatePermissionsDto.moduleId}' not found.`,
      );
    }
    updatePermissionsDto.moduleCode = moduleData?.code as string;
    updatePermissionsDto.moduleName = moduleData?.name as string;
    updatePermissionsDto.moduleStatus = moduleData?.status as boolean;

    const query = { _id: id };
    const update = {
      $set: { ...updatePermissionsDto },
    };

    const existingPermissions = await this.permissionsRepo.findOneAndUpdate(
      query,
      update,
    );
    if (!existingPermissions) {
      throw new NotFoundException(`Permission #${id} not found`);
    }
    if (existingPermissions && existingPermissions.status === false) {
      const removePermissionInRoles =
        await this.helperService.RemovePermissionFromRole(id);
      const removePermissionInUsers =
        await this.helperService.RemovePermissionFromUserDepartments(id);
    } else {
      const roleIds = await this.helperService.UpdatePermissionInRoles(
        id,
        existingPermissions,
      );

      if (roleIds.length > 0) {
        // Fetch role data for each roleId and call another function
        await Promise.all(
          roleIds.map(async (roleId) => {
            try {
              // Fetch role data using the role ID
              const roleData = await this.rolesRepo.findOne({ _id: roleId });

              if (!roleData) {
                throw new NotFoundException(`Role not found for ID: ${roleId}`);
              }

              const result = await this.helperService.UpdateRolesInUsers(
                roleId,
                roleData,
              );
            } catch (error) {
              console.error(`Error processing role ID ${roleId}:`, error);
            }
          }),
        );
      }
    }

    return { message: "The Permission has been successfully updated." };
  }

  async deletePermissionById(
    id: string,
    updatedBy: string,
  ): Promise<CreateUpdatePermissionResponseDto> {
    const query = { _id: id };
    const update = {
      $set: {
        status: false,
        updatedBy: updatedBy,
      },
    };
    const existingPermission = await this.permissionsRepo.findOneAndUpdate(
      query,
      update,
    );
    if (!existingPermission) {
      throw new NotFoundException(`Permission #${id} not found`);
    }
    const removePermissionInRoles =
      await this.helperService.RemovePermissionFromRole(id);
    const removePermissionInUsers =
      await this.helperService.RemovePermissionFromUserDepartments(id);
    return {
      message: "Permission has been successfully deleted",
    };
  }

  async getAllPermission(
    moduleId?: string,
  ): Promise<GetAllPermissionResponseDto> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const query: any = { status: true };

    // If moduleId is provided, add it to the query filter
    if (moduleId) {
      query.moduleId = moduleId;
    }
    const data = await this.permissionsRepo.find(query, {
      select: ["_id", "permissionCode", "permissionName"],
    });
    return {
      message: "All Permission data found successfully",
      data,
    };
  }
}
