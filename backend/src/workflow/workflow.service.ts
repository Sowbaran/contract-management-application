import {
  Injectable,
  NotFoundException,
  Logger,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId, Schema, Types } from "mongoose";

import {
  CreateWorkflowDto,
  WorkflowByMouduleIdResponseDto,
  WorkflowDto,
  WorkflowResponseDto,
  CreateUpdateWorkflowResponseDto,
  DeleteWorkflowResponseDto,
  workflowOrdertDTO,
} from "@src/workflow/dto";

import {
  WorkflowRepository,
  RolesRepository,
  FormModuleRepository,
  UsersRepository,
} from "@app/common";
import { PermissionCodes, TabRequest } from "@src/constants";
import { HelperService } from "../helper/helper.service";
@Injectable()
export class WorkflowService {
  private logger: Logger;

  constructor(
    private workflowRepo: WorkflowRepository,
    private rolesRepo: RolesRepository,
    private formModuleRepository: FormModuleRepository,
    private usersRepo: UsersRepository,
    private helperService: HelperService,
  ) {
    this.logger = new Logger(WorkflowService.name);
  }

  async createWorkflow(
    createWorkflowDto: CreateWorkflowDto,
  ): Promise<CreateUpdateWorkflowResponseDto> {
    await this.workflowPermissionValidate(
      createWorkflowDto.createdBy,
      createWorkflowDto.moduleId.toString(),
      TabRequest.VIEWCONFIGURATION,
    );
  
    // Extract roleIds from workflowOrder
    const roleIds = createWorkflowDto.workflowOrder.map((order) => order.role);
  
    // Fetch all valid roles
    const roles = await this.rolesRepo.find({
      _id: { $in: roleIds },
      moduleId: createWorkflowDto.moduleId,
      status: true,
    });
  
    if (roles.length !== createWorkflowDto.workflowOrder.length) {
      throw new NotFoundException(
        "Some roles in workflowOrder do not exist or are not active for this module",
      );
    }
  
    // Map for quick lookup
    const roleMap = new Map(roles.map((role) => [role._id.toString(), role]));
  
    // Set to track uniqueness
    const levelSet = new Set<number>();
    const roleNameSet = new Set<string>();
  
    // Enrich and validate workflowOrder
    const enrichedWorkflowOrder = createWorkflowDto.workflowOrder.map(
      (order: workflowOrdertDTO) => {
        const roleData = roleMap.get(order.role.toString());
        if (!roleData) {
          throw new NotFoundException(
            `Role ID ${order.role} not found or inactive for moduleId ${createWorkflowDto.moduleId}`,
          );
        }
  
        const level = Number(order.level);
        const name = roleData.name;
  
        if (levelSet.has(level)) {
          throw new BadRequestException(
            `Duplicate level detected in workflowOrder: ${level}`,
          );
        }
        if (roleNameSet.has(name)) {
          throw new BadRequestException(
            `Duplicate role name detected in workflowOrder: ${name}`,
          );
        }
  
        levelSet.add(level);
        roleNameSet.add(name);
  
        return {
          ...order,
          level,
          role:
            typeof order.role === "string"
              ? (new Types.ObjectId(order.role) as unknown as Schema.Types.ObjectId)
              : order.role,
          name: roleData.name,
          code: roleData.code,
        };
      },
    );
  
    // Sort by level ascending
    enrichedWorkflowOrder.sort((a, b) => a.level - b.level);
    createWorkflowDto.workflowOrder = enrichedWorkflowOrder;
  
    // Deactivate previous workflow if updating
    if (createWorkflowDto._id) {
      let version = createWorkflowDto.version;
      const query = { _id: createWorkflowDto._id, status: true };
      const update = { $set: { status: false } };
      const existingWorkflow = await this.workflowRepo.findOneAndUpdate(query, update);
  
      if (!existingWorkflow) {
        throw new NotFoundException(`workflow #${createWorkflowDto._id} not found`);
      }
  
      version = createWorkflowDto.version + 1;
      createWorkflowDto.version = version;
    }
  
    // Save new workflow
    const { _id, ...workflowToSave } = createWorkflowDto;
    const workflowData = await this.workflowRepo.create(workflowToSave);
  
    this.logger.log(`Workflow successfully created: ${JSON.stringify(workflowData)}`);
  
    return { message: "Workflow data created successfully" };
  }
  

  async getAllWorkflow(
    moduleId: string,
    emailId: string,
  ): Promise<WorkflowByMouduleIdResponseDto> {
    await this.workflowPermissionValidate(
      emailId,
      moduleId,
      TabRequest.VIEWCONFIGURATION,
    );
    const formData = await this.workflowRepo.find({
      moduleId: moduleId,
      status: true,
    });

    return {
      message: "All Workflow  data found successfully",
      data: formData as WorkflowDto[],
    };
  }

  async getWorkflow(
    id: string,
    moduleId: string,
    emailId: string,
  ): Promise<WorkflowResponseDto> {
    await this.workflowPermissionValidate(
      emailId,
      moduleId,
      TabRequest.VIEWCONFIGURATION,
    );
    const workflowData = await this.workflowRepo.findOne({
      _id: id,
      moduleId: moduleId,
    });
    return {
      message: "Workflow  found successfully",
      data: workflowData as WorkflowDto,
    };
  }

  async deleteWorkFlowById(
    id: string,
    moduleId: string,
    updatedBy: string,
  ): Promise<DeleteWorkflowResponseDto> {
    await this.workflowPermissionValidate(
      updatedBy,
      moduleId,
      TabRequest.VIEWCONFIGURATION,
    );
    const query = { _id: id, moduleId: moduleId };
    const update = {
      $set: {
        status: false,
        updatedBy: updatedBy,
      },
    };
    const existingPermission = await this.workflowRepo.findOneAndUpdate(
      query,
      update,
    );
    if (!existingPermission) {
      throw new NotFoundException(`Workflow #${id} not found`);
    }
    return {
      message: "Workflow has been successfully deleted",
    };
  }

  async workflowPermissionValidate(
    emailId: string,
    moduleId: string,
    type: string,
  ): Promise<void> {
    const options = { select: "code -_id" };
    const formModuleCode = await this.formModuleRepository.findById(
      moduleId,
      options,
    );
    if (!formModuleCode) {
      throw new NotFoundException(`Module #${moduleId} not found`);
    }
    const { code: moduleCode } = formModuleCode;
    const moduleType = moduleCode.toUpperCase() as keyof typeof PermissionCodes;

    const userDetails = await this.usersRepo.findOneExisting({
      email: emailId,
      status: true,
    });
    const departments = userDetails?.departments || [];
    this.logger.log(
      `Users List- ${userDetails ? JSON.stringify(userDetails.departments) : ""}`,
    );
    if (!departments || departments.length === 0) {
      throw new ForbiddenException(`Invalid permission  for user: ${emailId}`);
    }

    const permissionCode = this.helperService.getPermissionCode(
      type,
      moduleType,
    );

    this.logger.log(
      `Module Code: ${formModuleCode.code}, Permission Code: ${permissionCode}`,
    );
    const permissionCheck = await this.helperService.validatePermission(
      moduleCode,
      permissionCode,
      moduleId,
      departments,
    );
    this.logger.log(
      `Module Code: ${formModuleCode.code}, Permission Code: ${permissionCheck}`,
    );
    if (!permissionCheck) {
      throw new ForbiddenException(
        `The permission code provided is invalid for module: ${moduleCode}.`,
      );
    }
  }
}
