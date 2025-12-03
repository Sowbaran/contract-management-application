import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { trusted, Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class FormModule {
  @IsString()
  @IsNotEmpty()
  $oid: string;
}

export class CreateDepartmentsDto {
  @ApiProperty({
    description: "Id of the Module",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  menuModuleId: string;

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
    required: false,
    example: "technology",
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({
    description: "Description of the department",
    required: false,
    example: "Technology - Department",
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: "Id of the modules",
    required: false,
    example: ["65e3579de0ca70fe8f2e148e"],
  })
  @IsArray()
  @IsOptional()
  moduleId?: Types.ObjectId[];

  @ApiProperty({
    description: "Role of the department",
    required: false,
    example: ["65e3579de0ca70fe8f2e148e"],
  })
  @IsArray()
  @IsOptional()
  roles?: Types.ObjectId[];

  @ApiProperty({
    description: "status of the department",
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  status: boolean;

  @ApiProperty({
    description: "User who created this record",
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  createdBy: string;

  @ApiProperty({
    description: "User who updated this record",
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  updatedBy: string;
}

export class UpdateDepartmentRequestDto {
  @ApiProperty({
    description: "id of the department",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  id: string;
}

export class GetDetailsDepartmentsRequestDto {
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

export class GetDepartmentByModuleIdRequestDto {
  @ApiProperty({
    description: "id of the module",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  moduleId: string;
}

export class GetAdminAllDepartmentDto {
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
export interface AuthenticatedRequest extends Request {
  user: {
    preferred_username: string;
  };
}
