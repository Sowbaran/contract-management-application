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
  AuthenticatedRequest,
  CreateFormModuleDto,
  CreateUpdateModuleResponseDto,
  getAdminAllFormModulesDto,
  GetAllFormModuleResponseDto,
  GetAllModulesResponseDto,
  GetDetailsModulesRequestDto,
  GetModuleByIdResponseDto,
  UpdateFormModuleResponseDto,
  UpdateModuleDto,
} from "@src/form-module/dto";
import { FormModuleService } from "./form-module.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ErrorTypes } from "@src/utils/enums/error-types.enum";
import { query } from "express";

@Controller("form-module")
@ApiTags("Form Modules")
@ApiResponse({ status: 403, description: ErrorTypes.FORBIDDEN })
@ApiResponse({ status: 400, description: ErrorTypes.BAD_REQUEST })
@ApiResponse({ status: 500, description: ErrorTypes.INTERNAL_SERVER_ERROR })
export class FormModuleController {
  constructor(private readonly formModuleService: FormModuleService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: "The form module is been successfully added.",
    type: CreateUpdateModuleResponseDto
  })
  @ApiBody({ type: CreateFormModuleDto })
  @ApiOperation({
    operationId: "createFormModule",
    summary: "Create Form Module",
  })
  async createFormModule(
    @Body() createFormModuleDto: CreateFormModuleDto,
    @Req() request: AuthenticatedRequest,
  ) {
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
    createFormModuleDto.createdBy = request.user.preferred_username;
    }
    createFormModuleDto.code = createFormModuleDto.name.toLowerCase().replace(/\s+/g, "-");
    return await this.formModuleService.createFormModule(createFormModuleDto);
  }

  @Get("/list")
  @ApiResponse({
    status: 200,
    description: "The Admin list of modules has been successfully retrived",
    type: GetAllFormModuleResponseDto,
  })
  @ApiOperation({
    operationId: "getAdminFormModules",
    summary: "Get Form Module List",
  })
  async getFormModuleList(@Req() request: AuthenticatedRequest,@Query() queryParams: getAdminAllFormModulesDto) {
    let emailId = queryParams.email;
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      emailId = request.user.preferred_username;
    }
    return await this.formModuleService.getFormModuleList(
      queryParams.menuModuleId,
      emailId,
    );
  }

  @Get("/detail/:id")
  @ApiResponse({
    status: 200,
    description: "The Form modules has been successfully retrived",
    type: GetModuleByIdResponseDto,
  })
  @ApiOperation({
    operationId: "getFormModuleById",
    summary: "Get Form Module Detail By Id",
  })
  async getFormModuleDetail(@Param() id: UpdateModuleDto, @Req() request: AuthenticatedRequest,
      @Query() queryParams: GetDetailsModulesRequestDto) {
        let emailId = queryParams.email;
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      emailId = request.user.preferred_username;
    }
    return await this.formModuleService.getFormModuleDetail(id.id, queryParams.menuModuleId,emailId);
  }

  @Put("/:id")
  @ApiResponse({
    status: 200,
    description: "The form module is been updated successfully.",
    type: UpdateFormModuleResponseDto,
  })
  @ApiBody({ type: CreateFormModuleDto })
  @ApiOperation({
    operationId: "updateFormModule",
    summary: "Update Form Module",
  })
  async updateFormModule(
    @Param() id: UpdateModuleDto,
    @Body() updateFormModuleDto: CreateFormModuleDto,
    @Req() request: AuthenticatedRequest,
  ) {
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
    updateFormModuleDto.updatedBy = request.user.preferred_username;
    }
    return await this.formModuleService.updateFormModule(
      id.id,
      updateFormModuleDto,
    );
  }

  @Delete("/:id")
  @ApiResponse({
    status: 200,
    description: "The Form modules has been successfully deleted",
    type: CreateUpdateModuleResponseDto
  })
  @ApiOperation({
    operationId: "deleteFormModuleById",
    summary: "Delete Form Module By Id",
  })
  async deleteFormModule(@Param() id: UpdateModuleDto, @Req() request: AuthenticatedRequest) {
    return await this.formModuleService.deleteFormModule(
      id.id,
      request.user.preferred_username,
    );
  }

  @Get("/dropdown")
  @ApiResponse({
    status: 200,
    description: "The list of modules has been successfully retrived",
    type: GetAllModulesResponseDto,
  })
  @ApiOperation({
    operationId: "getFormModules",
    summary: "Get Form Module List - Dropdown",
  })
  async getAllFormModules() {
    return await this.formModuleService.getAllFormModules();
  }
}
