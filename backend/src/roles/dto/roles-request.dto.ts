import { ApiProperty } from "@nestjs/swagger";
import { Permissions } from "@src/permissions/permissions.model";
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsEmail,
} from "class-validator";
import { Types } from "mongoose";

export class FormModule {
  @IsString()
  @IsNotEmpty()
  $oid: string;
}

export class CreateRolesDto {
  @ApiProperty({
    description: "Id of the Module",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  menuModuleId: string;

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
  @IsOptional()
  code?: string;

  @ApiProperty({
    description: "description of the role",
    required: true,
    example: "Guest user",
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: "module accessible for the role",
    required: true,
    example: [
      "65def54ade3deddff04f79ad",
      "65def561de3deddff04f79ae",
      "65def325de3deddff04f79a0",
    ],
  })
  @IsArray()
  @IsNotEmpty()
  moduleId: Types.ObjectId[];

  @ApiProperty({
    description: "Status of the role",
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  status: boolean;

  @ApiProperty({
    description: "Is this Module Admin",
    required: false,
    example: ["65e3579de0ca70fe8f2e148e"],
  })
  @IsArray()
  @IsOptional()
  permissions: Types.ObjectId[];

  @ApiProperty({
    description: "who created the role",
    example: "vrameshbapu@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  createdBy: string;

  @ApiProperty({
    description: "who updated the role",
    example: "vrameshbapu@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  updatedBy: string;
}

export class UpdateRoleRequestDto {
  @ApiProperty({
    description: "id of the role",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  id: string;
}

export class RoleByDeptIdRequestDto {
  @ApiProperty({
    description: "id of the department",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  id: string;
}

export class RoleRequestDto {
  @ApiProperty({
    description: "id of the module",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  moduleId: string;
}

export class GetAdminAllRolesDto {
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
  @IsNotEmpty()
  email: string;
;
}

export class GetDetailsRolesRequestDto {
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
