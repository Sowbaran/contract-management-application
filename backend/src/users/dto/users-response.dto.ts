import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
} from "class-validator";
import { Types } from "mongoose";

class MetaDto {
  @ApiProperty({
    description: "Total number of rows available",
    required: true,
    example: 10,
  })
  totalRowCount: number;
}

class PermissionDto {
  @ApiProperty({
    description: "Unique identifier for the permission",
    example: "6764830f06b3bf201a390f86",
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Status of the permission",
    example: true,
  })
  status: boolean;

  @ApiProperty({
    description: "Permission code",
    example: "view-contract-request",
  })
  permissionCode: string;

  @ApiProperty({
    description: "Human-readable name for the permission",
    example: "view-configuration",
  })
  permissionName: string;

  @ApiProperty({
    description: "Module ID associated with the permission",
    example: "65e3579de0ca70fe8f2e148e",
  })
  moduleId: Types.ObjectId;

  @ApiProperty({
    description: "Code representing the module",
    example: "contract",
  })
  moduleCode: string;

  @ApiProperty({
    description: "Name of the module",
    example: "Contract",
  })
  moduleName: string;

  @ApiProperty({
    description: "Status of the module",
    example: true,
  })
  moduleStatus: boolean;
}

class RoleResponseDto {
  @ApiProperty({
    description: "Unique identifier of the role",
    example: "65def325de3deddff04f79a0",
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Name of the role",
    example: "Super Admin",
  })
  name: string;

  @ApiProperty({
    description: "Code of the role",
    example: "super-admin",
  })
  code: string;

  @ApiProperty({
    description: "Description of the role",
    example: "Super Admin",
  })
  description?: string;

  @ApiProperty({
    description: "Array of module IDs associated with the role",
    type: [Types.ObjectId],
    example: [
      "65e3579de0ca70fe8f2e148e",
      "65e357e0e0ca70fe8f2e1490",
      "65def137de3deddff04f799b",
    ],
  })
  moduleId: Types.ObjectId[];

  @ApiProperty({
    description: "Permissions associated with the role",
    type: [PermissionDto],
  })
  permissions: PermissionDto[];

  @ApiProperty({
    description: "Status of the role",
    example: true,
  })
  status: boolean;
}

class DepartmentsDto {
  @ApiProperty({
    description: "Unique identifier of the department",
    example: "65e767af49834fc6088bfba7",
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Code of the department",
    example: "chief-department",
  })
  code: string;

  @ApiProperty({
    description: "Name of the department",
    example: "Chief Department",
  })
  name: string;

  @ApiProperty({
    description: "Array of roles associated with the department",
    type: [RoleResponseDto],
  })
  roles: RoleResponseDto[];
}

class DepartmentsListDto {
  @ApiProperty({
    description: "Name of the department",
    example: "Chief Department",
  })
  name: string;

  @ApiProperty({
    description: "Array of roles associated with the department",
    type: [String],
    example:["CEO", "EGM"]
  })
  roles: string[];
}
class UserResponseDto {
  @ApiProperty({
    description: "Unique identifier for the user",
    example: "677d567870dc1af598b322a7",
  })
  @IsString()
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Name of the user",
    example: "Adamtest2",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Email address of the user",
    example: "vrameshbapu1@nrl.com.au",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "List of departments the user is associated with",
    type: [DepartmentsDto],
  })
  @IsArray()
  @IsOptional()
  departments: DepartmentsDto[];

  @ApiProperty({
    description: "Status of the user account",
    example: true,
  })
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    description: "User who created this record",
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  createdBy?: string;

  @ApiProperty({
    description: "User who last updated this record",
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  updatedBy?: string;
}

class UserListResponseDto {
  @ApiProperty({
    description: "Unique identifier for the user",
    example: "677d567870dc1af598b322a7",
  })
  @IsString()
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Name of the user",
    example: "Adamtest2",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Email address of the user",
    example: "vrameshbapu1@nrl.com.au",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "List of departments the user is associated with",
    type: [DepartmentsListDto],
  })
  @IsArray()
  @IsOptional()
  departments: DepartmentsListDto[];

  @ApiProperty({
    description: "Array of modules associated with the role",
    type: [String],
    example: [
      "Contract",
      "Headcount",
      "Settings",
    ],
  })
  modules?: string[];

  @ApiProperty({
    description: "Array of permisions associated with the role",
    type: [String],
    example: [
      "View Forms Menu",
      "View Configuration",
      "View My Requests Tab",
    ],
  })
  permissions?: string[];
  
  @ApiProperty({
    description: "Status of the user account",
    example: true,
  })
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    description: "User who created this record",
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  createdBy?: string;

  @ApiProperty({
    description: "User who last updated this record",
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  updatedBy?: string;
}
export class AdminRolesResponseDto {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: " Users data found successfully",
  })
  message: string;

  @ApiProperty({
    description: "The data returned by the operation",
    type: [UserListResponseDto],
  })
  data: UserListResponseDto[];

  @ApiProperty({
    description: "Meta data related to the response",
    type: MetaDto,
  })
  meta: MetaDto;
}

class GetDropDownResponse {
  @ApiProperty({
    description: "Id of the user",
    example: " 677d567870dc1af598b322a7",
  })
  @IsString()
  @IsNotEmpty()
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Name of the user",
    example: " Adam",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class GetAllUsersResponseDto {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: " User data found",
  })
  message: string;

  @ApiProperty({
    description: "The data returned by the operation",
    type: [GetDropDownResponse],
  })
  data: GetDropDownResponse[];
}

export class GetUserByIdResponseDto {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: " User data found successfully",
  })
  message: string;

  @ApiProperty({
    description: "The data returned by the operation",
    type: UserResponseDto,
  })
  data: UserResponseDto | null;
}

export class RoleDto {
  @ApiProperty({
    description: "Unique identifier for the role",
    example: "65def586de3deddff04f79af",
  })
  @IsString()
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Name of the role",
    example: "Requester",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Code representing the role",
    example: "guest-user",
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: "Status of the role",
    example: false,
  })
  @IsBoolean()
  status: boolean;
}

export class ModuleDto {
  @ApiProperty({
    description: "Unique identifier for the module",
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Name of the module",
    example: "Contract",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Code representing the module",
    example: "contract",
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: "Status of the module",
    example: true,
  })
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    description: "List of permissions for the module",
    example: ["view-forms-menu", "view-my-requests-tab"],
  })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}

export class UserDataDto {
  @ApiProperty({
    description: "Username of the user",
    example: "",
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: "Email address of the user",
    example: "bala@nrl.com.auff",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Roles assigned to the user",
    type: [RoleDto],
  })
  @IsArray()
  @IsOptional()
  roles: RoleDto[];

  @ApiProperty({
    description: "Modules accessible to the user",
    type: [ModuleDto],
  })
  @IsArray()
  @IsNotEmpty()
  modules: ModuleDto[];
}

export class UserMetaResponseDto {
  @ApiProperty({
    description: "Data payload containing user information",
    type: UserDataDto,
  })
  data: UserDataDto;
}

export class ImpersonateUserDto {
  @ApiProperty({
    description: "Name of the user",
    example: "Mohan",
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: "Email Id of the user",
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: "Department of users",
    example: [
      "Chief Department - Super Admin, CEO",
      "Technology - Executive General Manager, General Manager",
    ],
  })
  @IsArray()
  @IsOptional()
  departments: string[];
}

export class UserImpersonateResponseDto {
  @ApiProperty({
    description: "Data payload containing user information",
    type: [ImpersonateUserDto],
  })
  data: ImpersonateUserDto[];
}

export class CreateUpdateUserResponseDto {
  @ApiProperty({
    description: "User data created successfully",
    example: "The User has been successfully created/updated/deleted.",
  })
  message: string;
}
