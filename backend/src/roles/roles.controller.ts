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
  AdminRolesResponseDto,
  AuthenticatedRequest,
  ConfigurationResponseDto,
  CreateRolesDto,
  CreateUpdateRoleResponseDto,
  GetAdminAllRolesDto,
  GetAllRolesResponseDto,
  GetDetailsRolesRequestDto,
  GetRoleByIdResponseDto,
  RoleByDeptIdRequestDto,
  RoleRequestDto,
  UpdateRoleRequestDto,
} from "@src/roles/dto";
import { RolesService } from "./roles.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ErrorTypes } from "@src/utils/enums/error-types.enum";

@Controller("role")
@ApiTags("Roles")
@ApiResponse({ status: 403, description: ErrorTypes.FORBIDDEN })
@ApiResponse({ status: 400, description: ErrorTypes.BAD_REQUEST })
@ApiResponse({ status: 500, description: ErrorTypes.INTERNAL_SERVER_ERROR })
export class RolesController {
  constructor(private readonly RolesService: RolesService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: "The Role has been successfully created.",
    type: CreateUpdateRoleResponseDto,
  })
  @ApiBody({ type: CreateRolesDto })
  @ApiOperation({
    operationId: "createRole",
    summary: "Create Role",
  })
  async createRoles(
    @Body() createRolesDto: CreateRolesDto,
    @Req() request: AuthenticatedRequest,
  ) {
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      createRolesDto.createdBy = request.user.preferred_username;
    }
    createRolesDto.code = createRolesDto.name
      .toLowerCase()
      .replace(/\s+/g, "-");
    return await this.RolesService.createRole(createRolesDto);
  }

  @Get("/list")
  @ApiResponse({
    status: 200,
    description: "The Admin Roles has been retrived successfully",
    type: AdminRolesResponseDto,
  })
  @ApiOperation({
    operationId: "getRoleList",
    summary: "Get Role List",
  })
  async getRoleList(
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: GetAdminAllRolesDto,
  ) {
    let emailId = queryParams.email;
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      emailId = request.user.preferred_username;
    }
    return await this.RolesService.getRoleList(
      queryParams.menuModuleId,
      emailId,
       
    );
  }

  @Get("/detail/:id")
  @ApiResponse({
    status: 200,
    description: "The Roles has been retrived successfully",
    type: GetRoleByIdResponseDto,
  })
  @ApiOperation({
    operationId: "getRoleDetailById",
    summary: "Get Role Detail By Id",
  })
  async getRoleDetail(
    @Param() id: UpdateRoleRequestDto,
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: GetDetailsRolesRequestDto,
  ) {
    let emailId = queryParams.email;
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      emailId = request.user.preferred_username;
    }
    return await this.RolesService.getRoleDetail(
      id.id,
      queryParams.menuModuleId,
      emailId,
    );
  }

  @Put("/:id")
  @ApiResponse({
    status: 200,
    description: "The Role has been successfully updated.",
    type: CreateUpdateRoleResponseDto,
  })
  @ApiBody({ type: CreateRolesDto })
  @ApiOperation({
    operationId: "updateRole",
    summary: "Update Role By Id",
  })
  async updateRole(
    @Param() id: UpdateRoleRequestDto,
    @Body() updateRolestDto: CreateRolesDto,
    @Req() request: AuthenticatedRequest,
  ) {
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      updateRolestDto.updatedBy = request.user.preferred_username;
    }
    return await this.RolesService.updateRole(id.id, updateRolestDto);
  }

  @Delete("/:id")
  @ApiResponse({
    status: 200,
    description: "The Role has been successfully deleted",
    type: CreateUpdateRoleResponseDto,
  })
  @ApiOperation({
    operationId: "deleteRoleById",
    summary: "Delete Role By Id",
  })
  async deleteRole(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return await this.RolesService.deleteRoleById(
      id,
      request.user.preferred_username,
    );
  }

  @Get("configurationModules/:moduleId")
  @ApiResponse({
    status: 200,
    description: "The configuration Role has been retrived successfully",
    type: ConfigurationResponseDto,
  })
  @ApiOperation({
    operationId: "getConfigurationRoleById",
    summary: "Get Configuration Role By Id",
  })
  async getConfigurationRoles(@Param() moduleId: RoleRequestDto) {
    return await this.RolesService.getConfigurationRoles(moduleId.moduleId);
  }

  @Get("/dropdown")
  @ApiResponse({
    status: 200,
    description: "The Roles has been retrived successfully",
    type: GetAllRolesResponseDto,
  })
  @ApiOperation({
    operationId: "getAllRoles",
    summary: "Get All Roles - Dropdown",
  })
  async getAllRoles() {
    return await this.RolesService.getAllRoles();
  }

  @Get("/dropdown/:id")
  @ApiResponse({
    status: 200,
    description: "The Roles has been retrived successfully",
    type: GetAllRolesResponseDto,
  })
  @ApiOperation({
    operationId: "getAllRolesByDeptId",
    summary: "Get All Roles By Dept Id - Dropdown",
  })
  async getAllRolesByDeptId(@Param() id: RoleByDeptIdRequestDto) {
    return await this.RolesService.getAllRolesByDeptId(id.id);
  }
}
