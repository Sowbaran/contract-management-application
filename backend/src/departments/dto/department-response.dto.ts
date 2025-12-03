import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
} from "class-validator";
import { Types } from "mongoose";

export class DeptModuleResponse {
  @ApiProperty({
    description: "Id of the module",
    example: " 677d567870dc1af598b322a7",
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    description: "Name of the module",
    example: "Contract",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class DeptRoleResponse {
  @ApiProperty({
    description: "Id of the role",
    example: " 677d567870dc1af598b322a7",
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    description: "Name of the role",
    example: "Contract",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class GetDepartmentResponseDto {
  @ApiProperty({
    description: "Id of the department",
    example: " 677d567870dc1af598b322a7",
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    description: "Name of the department",
    required: true,
    example: "Technology",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Code of the department",
    required: true,
    example: "technology",
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: "description of the department",
    required: true,
    example: "technology",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Code of the department",
    required: true,
    type: [DeptModuleResponse],
  })
  @IsArray()
  @IsOptional()
  module?: DeptModuleResponse[];

  @ApiProperty({
    description: "roles of the department",
    required: true,
    type: [DeptRoleResponse],
  })
  @IsArray()
  @IsOptional()
  roles?: DeptRoleResponse[];

  @ApiProperty({
    description: "status of the department",
    required: true,
    example: "true",
  })
  @IsBoolean()
  @IsOptional()
  status: boolean;

  @ApiProperty({
    description: "user created the department",
    required: true,
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  createdBy?: string;

  @ApiProperty({
    description: "user updated the department",
    required: true,
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  updatedBy?: string;

  @ApiProperty({
    description: "Date and time when the department is been created ",
    required: true,
    example: "2024-03-02T16:45:17.346+00:00",
  })
  createdAt?: Date;

  @ApiProperty({
    description: "Date and time when the department is been updated",
    required: false,
    example: "2024-03-02T16:45:17.346+00:00",
  })
  updateAt?: Date;
}

export class GetDepartmentByIdResponseDto {
  @ApiProperty({
    description: "The data returned by the operation",
  })
  data: GetDepartmentResponseDto;
}

class MetaDto {
  @ApiProperty({
    description: "Total number of rows available",
    required: true,
    example: 0,
  })
  totalRowCount: number;
}

export class GetAllPerissionsAdminResponseDto {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: " All Departments data found successfully",
  })
  message: string;

  @ApiProperty({
    description: "list of Departments",
    required: true,
    type: [GetDepartmentResponseDto],
  })
  data: GetDepartmentResponseDto[];

  @ApiProperty({
    description: "Meta information",
    required: true,
  })
  meta: MetaDto;
}

class GetDropDownResponseDto {
  @ApiProperty({
    description: "Id of the department",
    required: true,
    example: "65e3923a6d98432f2ac48ac1",
  })
  @IsNotEmpty()
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Name of the department",
    required: true,
    example: "Technology",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class GetAllDepartmentResponseDto {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: " All Departments  data found successfully",
  })
  message: string;

  @ApiProperty({
    description: "The data returned by the operation",
    type: [GetDropDownResponseDto],
  })
  data: GetDropDownResponseDto[];
}

export class CreateUpdateDepartmentResponseDto {
  @ApiProperty({
    description: "Department data created successfully",
    example: "The Department has been successfully created/updated/deleted.",
  })
  message: string;
}

export class RoleDto {
  @ApiProperty({
    example: "65def4b2de3deddff04f79a9",
    description: "Unique identifier of the role",
  })
  _id: string;

  @ApiProperty({
    example: "Insurance Admin",
    description: "Name of the role",
  })
  name: string;
}

export class DepartmentWithRolesDto {
  @ApiProperty({
    example: "65e3923a6d98432f2ac48ac1",
    description: "Unique identifier of the department",
  })
  _id: string;

  @ApiProperty({
    example: "Insurance",
    description: "Name of the department",
  })
  name: string;

  @ApiProperty({
    type: [RoleDto],
    description: "List of roles associated with the department",
  })
  roles: RoleDto[];
}

export class GetAllDepartmentsWithRolesResponseDto {
  @ApiProperty({
    example: "All departments retrieved successfully",
    description: "Response message",
  })
  message: string;

  @ApiProperty({
    type: [DepartmentWithRolesDto],
    description: "Array of department objects with associated roles",
  })
  data: DepartmentWithRolesDto[];
}
