import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Put,
  Req,
  Delete,
} from "@nestjs/common";
import {
  CreateUpdatePermissionResponseDto,
  CreatePermissionsDto,
  GetAdminAllPermissionsDto,
  GetAllPerissionsResponseDto,
  GetAllPermissionResponseDto,
  GetPerissionsDetailsResponseDto,
  UpdatePermissionIdDto,
  DropDownRequestDto,
  GetDetailsPermissionsRequestDto,
  AuthenticatedRequest,
} from "@src/permissions/dto";
import { PermissionsService } from "./permissions.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ErrorTypes } from "@src/utils/enums/error-types.enum";

@Controller("permission")
@ApiTags("Permissions")
@ApiResponse({ status: 403, description: ErrorTypes.FORBIDDEN })
@ApiResponse({ status: 400, description: ErrorTypes.BAD_REQUEST })
@ApiResponse({ status: 500, description: ErrorTypes.INTERNAL_SERVER_ERROR })
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: "The Permission has been successfully created.",
    type: CreateUpdatePermissionResponseDto,
  })
  @ApiBody({ type: CreatePermissionsDto })
  @ApiOperation({
    operationId: "createPermission",
    summary: "Create Permission",
  })
  async createPermissions(
    @Body() createPermissionsDto: CreatePermissionsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      createPermissionsDto.createdBy = request.user.preferred_username;
    }
    createPermissionsDto.permissionCode = createPermissionsDto.permissionName
      .toLowerCase()
      .replace(/\s+/g, "-");
    return await this.permissionsService.createPermissions(
      createPermissionsDto,
    );
  }

  @Get("/list")
  @ApiResponse({
    status: 200,
    description: "The list of permissions has been successfully retrived.",
    type: GetAllPerissionsResponseDto,
  })
  @ApiOperation({
    operationId: "getPermissionList",
    summary: "Get list of Permissions",
  })
  async getPermissionList(
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: GetAdminAllPermissionsDto,
  ) {
    let emailId = queryParams.email;
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      emailId = request.user.preferred_username;
    }
    return await this.permissionsService.getPermissionList(
      queryParams.menuModuleId,
      emailId 
    );
  }

  @Get("/detail/:id")
  @ApiResponse({
    status: 200,
    description: "The permission has been successfully retrived.",
    type: GetPerissionsDetailsResponseDto,
  })
  @ApiOperation({
    operationId: "getPermissionById",
    summary: "Get Permission Detail By Id",
  })
  async getPermissionDetail(
    @Param() id: UpdatePermissionIdDto,
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: GetDetailsPermissionsRequestDto,
  ) {
    let emailId = queryParams.email;
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      emailId = request.user.preferred_username;
    }
    const response = await this.permissionsService.getPermissionDetail(
      id.id,
      queryParams.menuModuleId,
      emailId,
    );
    return { data: response };
  }

  @Put("/:id")
  @ApiResponse({
    status: 200,
    description: "The Permission has been successfully updated.",
    type: CreateUpdatePermissionResponseDto,
  })
  @ApiBody({ type: CreatePermissionsDto })
  @ApiOperation({
    operationId: "updatePermission",
    summary: "Update Permission By Id",
  })
  async updatePermission(
    @Param() id: UpdatePermissionIdDto,
    @Body() updatePermissionsDto: CreatePermissionsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      updatePermissionsDto.updatedBy = request.user.preferred_username;
    }
    return await this.permissionsService.updatePermission(
      id.id,
      updatePermissionsDto,
    );
  }

  @Delete("/:id")
  @ApiResponse({
    status: 200,
    description: "The permission has been successfully deleted",
    type: CreateUpdatePermissionResponseDto,
  })
  @ApiOperation({
    operationId: "deletePermissionById",
    summary: "Delete Permission By Id",
  })
  async deleteFormModule(
    @Param() id: UpdatePermissionIdDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return await this.permissionsService.deletePermissionById(
      id.id,
      request.user.preferred_username,
    );
  }

  @Get("/dropdown")
  @ApiResponse({
    status: 200,
    description: "The Permissions has been retrived successfully",
    type: GetAllPermissionResponseDto,
  })
  @ApiOperation({
    operationId: "getAllPermissionDropdown",
    summary: "Get All Permission - Dropdown",
  })
  async getAllPermission(@Query() moduleId?: DropDownRequestDto) {
    return await this.permissionsService.getAllPermission(moduleId?.moduleId);
  }
}
