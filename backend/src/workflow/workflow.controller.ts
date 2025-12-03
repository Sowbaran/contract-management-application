import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common";
import {
  CreateWorkflowDto,
  GetIdByParamsDto,
  GetModuleIdByParamsDto,
  UpdateWorkflowIdDto,
  WorkflowByMouduleIdResponseDto,
  WorkflowResponseDto,
  CreateUpdateWorkflowResponseDto,
  GetWorkflowListRequestDto,
  DeleteWorkflowResponseDto,
  AuthenticatedRequest,
} from "@src/workflow/dto";
import { WorkflowService } from "./workflow.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ErrorTypes } from "@src/utils/enums/error-types.enum";

@Controller("workflow")
@ApiTags("Workflow")
@ApiResponse({ status: 403, description: ErrorTypes.FORBIDDEN })
@ApiResponse({ status: 400, description: ErrorTypes.BAD_REQUEST })
@ApiResponse({ status: 500, description: ErrorTypes.INTERNAL_SERVER_ERROR })
export class WorkflowController {
  constructor(private readonly WorkflowService: WorkflowService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: "Workflow data created successfully",
    type: CreateUpdateWorkflowResponseDto,
  })
  @ApiBody({ type: CreateWorkflowDto })
  @ApiOperation({
    operationId: "createWorkFlow",
    summary: "Create WorkFlow",
  })
  async createWorkflow(
    @Body() createWorkflowDto: CreateWorkflowDto,
    @Req() request: AuthenticatedRequest,
  ) {
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      createWorkflowDto.createdBy = request.user.preferred_username;
    }
    return await this.WorkflowService.createWorkflow(createWorkflowDto);
  }

  @Get("workflow-module/:moduleId")
  @ApiResponse({
    status: 200,
    description: "Get List of workflow by moduleId",
    type: WorkflowByMouduleIdResponseDto,
  })
  @ApiOperation({
    operationId: "getWorkflowByModuleId",
    summary: " Get WorkFlow by ModuleId",
  })
  async getAllWorkflow(
    @Param() moduleId: GetModuleIdByParamsDto,
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: GetWorkflowListRequestDto,
  ) {
    console.log("request",request.user.preferred_username);
    let emailId = queryParams.email;
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      emailId = request.user.preferred_username;
    }
    return await this.WorkflowService.getAllWorkflow(
      moduleId.moduleId,
      emailId,
    );
  }

  @Get("/:id")
  @ApiResponse({
    status: 200,
    description: "Get List of workflow by Id",
    type: WorkflowResponseDto,
  })
  @ApiOperation({
    operationId: "getWorkflowById",
    summary: " Get WorkFlow by Id",
  })
  async getWorkflow(
    @Param() id: GetIdByParamsDto,
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: GetWorkflowListRequestDto,
  ) {
    let emailId = queryParams.email;
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      emailId = request.user.preferred_username;
    }
    return await this.WorkflowService.getWorkflow(
      id.id,
      queryParams.menuModuleId,
      emailId,
    );
  }

  @Delete("/:id")
  @ApiResponse({
    status: 200,
    description: "The workflow has been successfully deleted",
    type: DeleteWorkflowResponseDto,
  })
  @ApiOperation({
    operationId: "deleteWorkFlowById",
    summary: "Delete WorkFlow By Id",
  })
  async deleteFormModule(
    @Param() id: UpdateWorkflowIdDto,
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: GetWorkflowListRequestDto,
  ) {
    let emailId = queryParams.email;
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      emailId = request.user.preferred_username;
    }
    return await this.WorkflowService.deleteWorkFlowById(
      id.id,
      queryParams.menuModuleId,
      emailId,
    );
  }
}
