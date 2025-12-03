import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class CreatePermissionsDto {
  @ApiProperty({
    description: "Id of the Module",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  menuModuleId: string;

  @ApiProperty({
    description: "Id of the Module",
    required: true,
    example: "67724451c6fdbee05f9644f8",
  })
  @IsString()
  @IsNotEmpty()
  moduleId: Types.ObjectId;

  @ApiProperty({
    description: "Premission code",
    required: false,
    example: "view-Contract-request",
  })
  @IsString()
  @IsOptional()
  permissionCode?: string;

  @ApiProperty({
    description: "Premission name",
    required: true,
    example: "view-Contract-request",
  })
  @IsString()
  @IsNotEmpty()
  permissionName: string;

  @ApiProperty({
    description: "Module code",
    required: false,
    example: "contract",
  })
  @IsString()
  @IsOptional()
  moduleCode: string;

  @ApiProperty({
    description: "Module name",
    required: false,
    example: "contract",
  })
  @IsString()
  @IsOptional()
  moduleName: string;

  @ApiProperty({
    description: "description of the module ",
    required: true,
    example: "Allows access to module settings page",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "status of the permission ",
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    description: "status of the module ",
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  moduleStatus: boolean;

  @ApiProperty({
    description: "User who created this record",
    example: "vrameshbapu@nrl.com.au",
  })
  @IsOptional()
  @IsString()
  createdBy: string;

  @ApiProperty({
    description: "User who updated this record",
    example: "vrameshbapu@nrl.com.au",
  })
  @IsOptional()
  @IsString()
  updatedBy: string;
}

export class GetAdminAllPermissionsDto {
  @ApiProperty({
    description: "Id of the Module",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  menuModuleId: string;

  @ApiProperty({
    description: "Email address of the user",
    example: "balak@nrl.com.au",
  })
  @IsEmail()
  @IsOptional()
  email: string;
}

export class UpdatePermissionIdDto {
  @ApiProperty({
    description: "id of the Permission",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  id: string;
}

export class GetDetailsPermissionsRequestDto {
  @ApiProperty({
    description: "Id of the Module",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  menuModuleId: string;

  @ApiProperty({
    description: "Email address of the user",
    example: "balak@nrl.com.au",
  })
  @IsEmail()
  @IsOptional()
  email: string;
}

export class DropDownRequestDto {
  @ApiProperty({
    description: "Id of the module",
    required: false,
    example: " 65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsOptional()
  moduleId: string;
} 

export interface AuthenticatedRequest extends Request {
  user: {
    preferred_username: string;
  };
}
