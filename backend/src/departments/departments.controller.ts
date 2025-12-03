import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Post,
  Put,
  Logger,
  Delete,
  Req,
} from "@nestjs/common";
import {
  AuthenticatedRequest,
  CreateDepartmentsDto,
  CreateUpdateDepartmentResponseDto,
  GetAdminAllDepartmentDto,
  GetAllDepartmentResponseDto,
  GetAllDepartmentsWithRolesResponseDto,
  GetAllPerissionsAdminResponseDto,
  GetDepartmentByIdResponseDto,
  GetDepartmentByModuleIdRequestDto,
  GetDetailsDepartmentsRequestDto,
  UpdateDepartmentRequestDto,
} from "@src/departments/dto";
import { DepartmentsService } from "./departments.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ErrorTypes } from "@src/utils/enums/error-types.enum";

@Controller("departments")
@ApiTags("Departments")
@ApiResponse({ status: 403, description: ErrorTypes.FORBIDDEN })
@ApiResponse({ status: 400, description: ErrorTypes.BAD_REQUEST })
@ApiResponse({ status: 500, description: ErrorTypes.INTERNAL_SERVER_ERROR })
export class DepartmentsController {
  private logger = new Logger(DepartmentsController.name);
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: "The department has been successfully created.",
    type: CreateUpdateDepartmentResponseDto,
  })
  @ApiBody({ type: CreateDepartmentsDto })
  @ApiOperation({
    operationId: "createDepartment",
    summary: "Create Department",
  })
  async createDepartment(
    @Body() createDepartmentsDto: CreateDepartmentsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    this.logger.log("Creating departments");
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      createDepartmentsDto.createdBy = request.user.preferred_username;
    }
    createDepartmentsDto.code = createDepartmentsDto.name
      .toLowerCase()
      .replace(/\s+/g, "-");
    return await this.departmentsService.createDepartment(createDepartmentsDto);
  }

  @Get("/list")
  @ApiResponse({
    status: 200,
    description: "The list of departments has been successfully retrived.",
    type: GetAllPerissionsAdminResponseDto,
  })
  @ApiOperation({
    operationId: "getAllDepartmentsAdmin",
    summary: "Get Department List",
  })
  async getDepartmentList(
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: GetAdminAllDepartmentDto,
  ) {
    this.logger.log("Getting all admin departments");
    let emailId = queryParams.email;
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      emailId = request.user.preferred_username;
    }
    return await this.departmentsService.getDepartmentList(
      queryParams.menuModuleId,
      emailId,
    );
  }

  @Get("/detail/:id")
  @ApiResponse({
    status: 200,
    description: "The department has been successfully retrived.",
    type: GetDepartmentByIdResponseDto,
  })
  @ApiOperation({
    operationId: "getDepartmentById",
    summary: "Get Department Detail By Id",
  })
  async getDepartmentDetail(
    @Param() id: UpdateDepartmentRequestDto,
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: GetDetailsDepartmentsRequestDto,
  ) {
    let emailId = queryParams.email;
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      emailId = request.user.preferred_username;
    }
    this.logger.log("Getting department by id");
    return await this.departmentsService.getDepartmentDetail(
      id.id,
      queryParams.menuModuleId,
      emailId,
    );
  }

  @Put("/:id")
  @ApiResponse({
    status: 200,
    description: "The department has been successfully updated.",
    type: CreateUpdateDepartmentResponseDto,
  })
  @ApiBody({ type: CreateDepartmentsDto })
  @ApiOperation({
    operationId: "updateDepartment",
    summary: "Update Department By Id",
  })
  async updateDepartments(
    @Param() id: UpdateDepartmentRequestDto,
    @Body() updateDepartmentsDto: CreateDepartmentsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    this.logger.log("Updating departments");
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      updateDepartmentsDto.updatedBy = request.user.preferred_username;
    }
    return await this.departmentsService.updateDepartment(
      id.id,
      updateDepartmentsDto,
    );
  }

  @Delete("/:id")
  @ApiResponse({
    status: 200,
    description: "The department has been successfully deleted",
    type: CreateUpdateDepartmentResponseDto,
  })
  @ApiOperation({
    operationId: "deleteDepartmentById",
    summary: "Delete Department By Id",
  })
  async deleteFormModule(
    @Param() id: UpdateDepartmentRequestDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return await this.departmentsService.deleteDepartmentById(
      id.id,
      request.user.preferred_username,
    );
  }

  @Get("/dropdown")
  @ApiResponse({
    status: 200,
    description: "All departments has been retrived successfully.",
    type: GetAllDepartmentResponseDto,
  })
  @ApiOperation({
    operationId: "getAllDepartments",
    summary: "Get All Departments - Dropdown",
  })
  async getAllDepartments() {
    this.logger.log("Getting all departments");
    return await this.departmentsService.getAllDepartments();
  }

  @Get("forms/dropdown/:moduleId")
  @ApiResponse({
    status: 200,
    description: "All departments has been retrived successfully.",
    type: GetAllDepartmentResponseDto,
  })
  @ApiOperation({
    operationId: "getAllDepartmentsByModuleId",
    summary: "Get All Departments By Module Id - Dropdown",
  })
  async getAllDepartmentsByModuleId(
    @Param() id: GetDepartmentByModuleIdRequestDto,
  ) {
    this.logger.log("Getting all departments");
    return await this.departmentsService.getAllDepartmentsByModuleId(
      id.moduleId,
    );
  }

  @Get("User/dropdown")
  @ApiResponse({
    status: 200,
    description: "All departments with has been retrived successfully.",
    type: GetAllDepartmentsWithRolesResponseDto,
  })
  @ApiOperation({
    operationId: "getAllUserDepartments",
    summary: "Get All User Departments - Dropdown",
  })
  async getAllUserDepartments() {
    return await this.departmentsService.getAllDepartmentsWithRoles();
  }
}
