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
  CreateUpdateUserResponseDto,
  CreateUsersDto,
  GetAdminAllUsersDto,
  GetAllUsersResponseDto,
  GetUserByIdResponseDto,
  UserImpersonateResponseDto,
  UserMetaResponseDto,
  UserRequestDto,
  GetDetailsUsersRequestDto,
} from "@src/users/dto";
import { UsersService } from "./users.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ErrorTypes } from "@src/utils/enums/error-types.enum";
import { AuthenticatedRequest, ContractGetFormListParamsDto } from "@src/form-details/dto";
import { BypassAuth } from "@src/decorators";

@Controller("user")
@ApiTags("Users")
@ApiResponse({ status: 403, description: ErrorTypes.FORBIDDEN })
@ApiResponse({ status: 400, description: ErrorTypes.BAD_REQUEST })
@ApiResponse({ status: 500, description: ErrorTypes.INTERNAL_SERVER_ERROR })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: "The user has been successfully created.",
    type: CreateUpdateUserResponseDto,
  })
  @ApiBody({ type: CreateUsersDto })
  @ApiOperation({
    operationId: "createUser",
    summary: "Create User",
  })
  async createUser(
    @Body() createUsersDto: CreateUsersDto,
    @Req() request: AuthenticatedRequest,
  ) {
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      createUsersDto.createdBy = request.user.preferred_username;
    }
    return await this.usersService.createUser(createUsersDto);
  }

  @Get("/list")
  @ApiResponse({
    status: 200,
    description: "All users of admin has been successfully retrived.",
    type: AdminRolesResponseDto,
  })
  @ApiOperation({
    operationId: "getUserList",
    summary: "Get User List",
  })
  async getUserList(
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: GetAdminAllUsersDto,
  ) {
    let emailId = queryParams.email;
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      emailId = request.user.preferred_username;
    }
    return await this.usersService.getUserList(
      queryParams.menuModuleId,
      emailId,
    );
  }

  @Get("/detail/:id")
  @ApiResponse({
    status: 200,
    description: "User has been successfully retrived.",
    type: GetUserByIdResponseDto,
  })
  @ApiOperation({
    operationId: "getUserById",
    summary: "Get User Detail By Id",
  })
  async getUserDetail(
    @Param() id: UserRequestDto,
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: GetDetailsUsersRequestDto,
  ) {
    let emailId = queryParams.email;
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      emailId = request.user.preferred_username;
    }
    return await this.usersService.getUserDetail(
      id.id,
      queryParams.menuModuleId,
      emailId,
    );
  }

  @Put("/:id")
  @ApiResponse({
    status: 200,
    description: "The user has been successfully updated.",
    type: CreateUpdateUserResponseDto,
  })
  @ApiBody({ type: CreateUsersDto })
  @ApiOperation({
    operationId: "updateUser",
    summary: "Update User By Id",
  })
  async updateUser(
    @Param("id") id: string,
    @Body() updateUsersDto: CreateUsersDto,
    @Req() request: AuthenticatedRequest,
  ) {
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      updateUsersDto.updatedBy = request.user.preferred_username;
    }
    return await this.usersService.updateUser(id, updateUsersDto);
  }

  @Delete("/:id")
  @ApiResponse({
    status: 200,
    description: "The User has been successfully deleted",
    type: CreateUpdateUserResponseDto,
  })
  @ApiOperation({
    operationId: "deleteUserById",
    summary: "Delete User By Id",
  })
  async deleteUser(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return await this.usersService.deleteUserById(
      id,
      request.user.preferred_username,
    );
  }

  @Get("/dropdown")
  @ApiResponse({
    status: 200,
    description: "List of users has been successfully retrived.",
    type: GetAllUsersResponseDto,
  })
  @ApiOperation({
    operationId: "getAllUsersDropdown",
    summary: "Get All Users - Dropdown",
  })
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get("/profile/:email")
  @ApiResponse({
    status: 200,
    description: "User meta has been successfully retrived.",
    type: UserMetaResponseDto,
  })
  @ApiOperation({
    operationId: "getUserMeta",
    summary: "Get Logged User Profile Details",
  })
  async getUserProfile(
    @Req() request: AuthenticatedRequest,
    @Param() emailId: ContractGetFormListParamsDto,
  ): Promise<UserMetaResponseDto> {
    let email: string;
    if (
      process.env.ENVIRONMENT === "local" ||
      process.env.ENVIRONMENT === "dev"
    ) {
      email = emailId.email;
    } else {
      email = request.user.preferred_username;
    }
    return await this.usersService.getUserProfileDetail(
      email,
      request.user.name,
    );
  }

  @Get("/impersonate/user/list")
  @ApiResponse({
    status: 200,
    description: "Impersonate user list has been successfully retrived.",
    type: UserImpersonateResponseDto,
  })
  @ApiOperation({
    operationId: "getImpersonateUsersList",
    summary: "Get Impersonate User List",
  })
  async impersonateUsersList() {
    const data = await this.usersService.impersonateUsersList();
    return data;
  }
}
