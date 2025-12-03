import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class CreateFormModuleDto {
  @ApiProperty({
    description: "Id of the Module",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  menuModuleId: string;

  @ApiProperty({
    description: "Name of the form Module",
    required: true,
    example: "contract",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "code of the form Module",
    required: true,
    example: "contract",
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({
    description: "Description of the form Module",
    required: true,
    example: "Vendor Contract",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "status of the form Module",
    required: false,
    example: "true",
  })
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    description: "User who created this record",
    example: "vrameshbapu@nrl.com.au",
  })
  @IsOptional()
  @IsString()
  createdBy: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiProperty({
    description: "User who updated this record",
    example: "vrameshbapu@nrl.com.au",
  })
  @IsOptional()
  @IsString()
  updatedBy: string;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}

export class UpdateModuleDto {
  @ApiProperty({
    description: "id of the module",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  id: string;
}

export class GetDetailsModulesRequestDto {
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

export class getAdminAllFormModulesDto {
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
