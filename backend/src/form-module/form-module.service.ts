import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  CreateFormModuleDto,
  CreateUpdateModuleResponseDto,
  GetAllFormModuleResponseDto,
  GetAllModulesResponseDto,
  GetModuleByIdResponseDto,
  UpdateFormModuleResponseDto,
} from "@src/form-module/dto";
import { FormModule } from "./form-module.model";
import { FormModuleRepository, PermissionsRepository } from "@app/common";
import { escapeRegExp } from "@src/utils";
import { HelperService } from "@src/helper/helper.service";
import { PermissionCodes } from "@src/constants";

@Injectable()
export class FormModuleService {
  protected readonly logger = new Logger(FormModuleService.name);
  constructor(
    private formModuleRepo: FormModuleRepository,
    private permissionRepo: PermissionsRepository,
    private helperService: HelperService,
    @InjectModel("FormModule") private formModuleModel: Model<FormModule>,
  ) {}

  async createFormModule(
    createFormModuleDto: CreateFormModuleDto,
  ): Promise<CreateUpdateModuleResponseDto> {
    const { code, name, menuModuleId } = createFormModuleDto;
    await this.helperService.settingsPermissionCheck(
      createFormModuleDto.createdBy,
      menuModuleId,
      PermissionCodes.SETTINGS.VIEWMODULESETTINGS,
    );
    const formModuleDetails = await this.formModuleRepo.findOneExisting({
      $or: [{ code: code?.toLowerCase() }, { name: name.toLowerCase() }],
    });
    if (formModuleDetails) {
      let message = "";
      if (formModuleDetails.code === code) {
        message = `Module code '${code}' already exists in our database`;
      } else {
        message = `Module name '${name}' already exists in our database`;
      }
      throw new ConflictException(message);
    }
    await this.formModuleRepo.create({
      ...createFormModuleDto,
      code: createFormModuleDto.code as string,
    });
    return {
      message: "Form Module has been created successfully",
    };
  }

  async getFormModuleList(
    moduleId: string,
    emailId: string,
  ): Promise<GetAllFormModuleResponseDto> {
    await this.helperService.settingsPermissionCheck(
      emailId,
      moduleId,
      PermissionCodes.SETTINGS.VIEWMODULESETTINGS,
    );
    const sortCriteria = { _id: -1 };
    const data = await this.formModuleRepo.find(
      {},
      {
        sort: sortCriteria,
      },
    );
    const totalRowCount = data.length;
    return {
      data,
      meta: {
        totalRowCount,
      },
    };
  }

  async getFormModuleDetail(
    id: string,
    moduleId: string,
    emailId: string,
  ): Promise<GetModuleByIdResponseDto> {
    await this.helperService.settingsPermissionCheck(
      emailId,
      moduleId,
      PermissionCodes.SETTINGS.VIEWMODULESETTINGS,
    );
    const Data = await this.formModuleRepo.findById(id);
    return {
      message: "Form Module found successfully",
      data: Data,
    };
  }

  async updateFormModule(
    id: string,
    updateFormModuletDto: CreateFormModuleDto,
  ): Promise<UpdateFormModuleResponseDto> {
    const { name, updatedBy, menuModuleId } = updateFormModuletDto;
    await this.helperService.settingsPermissionCheck(
      updatedBy,
      menuModuleId,
      PermissionCodes.SETTINGS.VIEWMODULESETTINGS,
    );
    if (name) {
      const existingData = await this.formModuleRepo.findOneExisting({
        $or: [{ name: name.toLowerCase() }],
        _id: { $ne: id },
      });
      if (existingData) {
        let message = "";
        message = `Module name '${name}' already exists in our database`;
        throw new ConflictException(message);
      }

      const fomrModuleData = await this.formModuleRepo.findOne({ _id: id });
      updateFormModuletDto.code = fomrModuleData.code;

      const query = { _id: id };
      const update = {
        $set: { ...updateFormModuletDto },
      };

      const existingFormModule = await this.formModuleRepo.findOneAndUpdate(
        query,
        update,
      );
      if (!existingFormModule) {
        throw new NotFoundException(`FormModule #${id} not found`);
      }

      if (existingFormModule && existingFormModule.status === false) {
        await this.helperService.InActivateModuleStatusInPermissions(id, updatedBy);
        await this.helperService.RemovePermissionFromRoleByModuleId(id, updatedBy);
        await this.helperService.RemovePermissionFromUserDepartmentsByModuleId(
          id,updatedBy
        );
        //await this.helperService.RemoveModuleFromRole(id);
        //await this.helperService.RemoveModuleFromUserRoles(id);
      } else {
        const updatedPermissions =
          await this.helperService.UpdateModuleInPermissions(
            id,
            existingFormModule.name,
            existingFormModule.status as boolean,
          );
        const updatedRoles = await this.helperService.UpdateModuleInRoles(
          id,
          existingFormModule.name,
          existingFormModule.status as boolean,
        );
        const updatedUsers = await this.helperService.UpdateModuleInUsers(
          id,
          existingFormModule.name,
          existingFormModule.status as boolean,
        );
      }
      return {
        message: "Form Module has been successfully updated",
        data: existingFormModule,
      };
    }
    throw new BadRequestException("Invalid request");
  }

  async deleteFormModule(
    id: string,
    updatedBy: string,
  ): Promise<CreateUpdateModuleResponseDto> {
    const query = { _id: id };
    const update = {
      $set: {
        status: false,
        updatedBy: updatedBy,
      },
    };
    const existingFormModule = await this.formModuleRepo.findOneAndUpdate(
      query,
      update,
    );
    if (!existingFormModule) {
      throw new NotFoundException(`FormModule #${id} not found`);
    }
    await this.helperService.InActivateModuleStatusInPermissions(id,updatedBy);
    await this.helperService.RemovePermissionFromRoleByModuleId(id, updatedBy);
    await this.helperService.RemovePermissionFromUserDepartmentsByModuleId(id, updatedBy);

    return {
      message: "Form Module has been successfully deleted",
    };
  }

  async getAllFormModules(): Promise<GetAllModulesResponseDto> {
    const modules = await this.formModuleRepo.find(
      { status: true },
      { select: ["_id", "name"] },
    );

    const modulesWithPermissions = await Promise.all(
      modules.map(async (module) => {
        const permissions = await this.permissionRepo.find(
          { moduleId: module._id, status: true },
          { select: ["_id", "permissionName"] },
        );

        return {
          _id: module._id,
          name: module.name,
          permissions,
        };
      }),
    );

    return {
      message: "All Form Module data found successfully",
      data: modulesWithPermissions,
    };
  }
}
