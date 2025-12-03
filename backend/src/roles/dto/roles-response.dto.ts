import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsBoolean,
} from "class-validator";
import { Types } from "mongoose";

export class ModulePermissionResponseDto {
  @ApiProperty({
    description: "Id of the permission",
    example: " 677d567870dc1af598b322a7",
  })
  @IsString()
  @IsNotEmpty()
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Name of the permission",
    example: "Contract",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ModuleResponseDto {
  @ApiProperty({
    description: "Id of the module",
    example: " 677d567870dc1af598b322a7",
  })
  @IsString()
  @IsNotEmpty()
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Name of the module",
    example: "Contract",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Name of the module",
    type: [ModulePermissionResponseDto],
  })
  @IsArray()
  @IsNotEmpty()
  permissions: ModulePermissionResponseDto[];
}

export class RolesDto {
  @ApiProperty({
    description: "Id of the role",
    required: true,
    example: "677dfb7a8baf600dfa524bb4",
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: "name of the role",
    required: true,
    example: "Requester",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "name of the role",
    required: true,
    example: "Requester",
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: "description of the role",
    required: true,
    example: "Guest user",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "module accessible for the role",
    required: true,
    type: [ModuleResponseDto],
  })
  @IsArray()
  @IsNotEmpty()
  module: ModuleResponseDto[];

  @ApiProperty({
    description: "Status of the role",
    required: false,
    example: "true",
  })
  @IsBoolean()
  @IsOptional()
  status: boolean;

  @ApiProperty({
    description: "User name who created the role",
    required: false,
    example: "bbharathivel@nrl.com.au",
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({
    description: "User name who updated the role",
    required: false,
    example: "bbharathivel@nrl.com.au",
  })
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @ApiProperty({
    description: "Date and time when the permission is been created ",
    required: true,
    example: "2024-03-02T16:45:17.346+00:00",
  })
  createdAt?: Date;

  @ApiProperty({
    description: "Date and time when the permission is been updated",
    required: false,
    example: "2024-03-02T16:45:17.346+00:00",
  })
  updateAt?: Date;
}

export class RolesDropDownDto {
  @ApiProperty({
    description: "Id of the role",
    required: true,
    example: "677dfb7a8baf600dfa524bb4",
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: "name of the role",
    required: true,
    example: "Requester",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "name of the code",
    required: true,
    example: "Requester",
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class GetAllRolesResponseDto {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: " All Roles data found successfully",
  })
  message: string;

  @ApiProperty({
    description: "The data returned by the operation",
    type: [RolesDropDownDto],
  })
  data: RolesDropDownDto[];
}

export class GetRoleByIdResponseDto {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: " All Role data found successfully",
  })
  message: string;

  @ApiProperty({
    description: "The data returned by the operation",
    type: RolesDto,
  })
  data: RolesDto | null;
}

class ConfigurationDto {
  @ApiProperty({
    description: "Id of the role",
    required: true,
    example: "677dfb7a8baf600dfa524bb4",
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: "name of the role",
    required: true,
    example: "Requester",
  })
  name: string;

  @ApiProperty({
    description: "name of the role",
    required: true,
    example: "Requester",
  })
  code: string;
}

export class PermissionsDto {
  @ApiProperty({
    description: "Unique identifier of the module entity",
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Unique identifier for the module",
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  moduleId: Types.ObjectId;

  @ApiProperty({
    description: "Code representing the permission",
    example: "read-access",
  })
  @IsString()
  @IsNotEmpty()
  permissionCode: string;

  @ApiProperty({
    description: "Name of the permission",
    example: "Read Access",
  })
  @IsString()
  @IsNotEmpty()
  permissionName: string;

  @ApiProperty({
    description: "Code representing the module",
    example: "user-management",
  })
  @IsString()
  @IsNotEmpty()
  moduleCode: string;

  @ApiProperty({
    description: "Name of the module",
    example: "User Management",
  })
  @IsString()
  @IsNotEmpty()
  moduleName: string;

  @ApiProperty({
    description: "Status of the module",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  moduleStatus: boolean;

  @ApiProperty({
    description: "Description of the module",
    example: "This module handles user-related operations.",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Overall status of the entity",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}

export class RolesListDto {
  @ApiProperty({
    description: "Id of the role",
    required: true,
    example: "677dfb7a8baf600dfa524bb4",
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: "name of the role",
    required: true,
    example: "Requester",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "name of the role",
    required: true,
    example: "Requester",
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: "description of the role",
    required: true,
    example: "Guest user",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "module accessible for the role",
    required: true,
    example: [
      "65e3579de0ca70fe8f2e148e",
      "65e357e0e0ca70fe8f2e1490",
      "65def137de3deddff04f799b",
    ],
  })
  @IsArray()
  @IsNotEmpty()
  moduleId: Types.ObjectId[];

  @ApiProperty({
    description: "Status of the role",
    required: false,
    example: "true",
  })
  @IsBoolean()
  @IsOptional()
  status: boolean;

  @ApiProperty({
    description: "Is this Module Admin",
    required: false,
    type: [PermissionsDto],
  })
  @IsArray()
  @IsOptional()
  permissions: PermissionsDto[];

  @ApiProperty({
    description: "User name who created the role",
    required: false,
    example: "bbharathivel@nrl.com.au",
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({
    description: "User name who updated the role",
    required: false,
    example: "bbharathivel@nrl.com.au",
  })
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @ApiProperty({
    description: "Date and time when the permission is been created ",
    required: true,
    example: "2024-03-02T16:45:17.346+00:00",
  })
  createdAt?: Date;

  @ApiProperty({
    description: "Date and time when the permission is been updated",
    required: false,
    example: "2024-03-02T16:45:17.346+00:00",
  })
  updateAt?: Date;
}

export class ConfigurationResponseDto {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: " All Roles data found successfully",
  })
  message: string;

  @ApiProperty({
    description: "The data returned by the operation",
    type: [ConfigurationDto],
  })
  data: ConfigurationDto[];
}

class MetaDto {
  @ApiProperty({
    description: "Total number of rows available",
    required: true,
    example: 0,
  })
  totalRowCount: number;
}

export class AdminRolesResponseDto {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: " All Role data found successfully",
  })
  message: string;

  @ApiProperty({
    description: "The data returned by the operation",
    type: [RolesListDto],
  })
  data: RolesListDto[];

  @ApiProperty({
    description: "Meta data related to the response",
    type: MetaDto,
  })
  meta: MetaDto;
}

export class CreateUpdateRoleResponseDto {
  @ApiProperty({
    description: "Role data created successfully",
    example: "The Role has been successfully created/updated/deleted.",
  })
  message: string;
}
