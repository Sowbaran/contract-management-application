import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsDate,
  IsEmail,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

class DepartmentDto {
  @ApiProperty({
    description: "Unique identifier of the department",
    example: "65e767af49834fc6088bfba7",
  })
  @IsString()
  _id: string;

  @ApiProperty({
    description: "List of roles associated with the department",
    example: ["65def325de3deddff04f79a0", "65def561de3deddff04f79ae"],
    type: [String],
  })
  @IsArray()
  roles: string[];
}

export class CreateUsersDto {
  @ApiProperty({
    description: "Id of the Module",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  menuModuleId: string;

  @ApiProperty({
    description: "Name of the user",
    example: "Mohan Murugesan",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Email address of the user",
    example: "mmurugesan@nrl.com.au",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "List of departments the user belongs to",
    type: [DepartmentDto],
  })
  @ValidateNested({ each: true })
  @Type(() => DepartmentDto)
  departments: DepartmentDto[];

  @ApiProperty({
    description: "Status of the user",
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
    description: "User who created this record",
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  updatedBy: string;
}

export class GetDetailsUsersRequestDto {
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

export class GetAdminAllUsersDto {
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

  @ApiProperty({
    description: "The starting index for pagination",
    example: "0",
    required: false,
  })
  @IsOptional()
  start?: string;

  @ApiProperty({
    description: "The number of items to be retrieved per page",
    example: "10",
    required: false,
  })
  @IsOptional()
  size?: string;

  @ApiProperty({
    description: "Search text for filtering results",
    example: "example search text",
    required: false,
  })
  @IsOptional()
  searchText?: string;

  @ApiProperty({
    description: "Field by which to sort the results",
    example: "ASC",
    required: false,
  })
  @IsOptional()
  sortBy?: string;

  @ApiProperty({
    description: "Sorting order, either true (ascending) or false (descending)",
    example: "true",
    required: false,
  })
  @IsOptional()
  sortOrder?: boolean;
}

export class UserRequestDto {
  @ApiProperty({
    description: "Id of the user",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  id: string;
}

export class UserMetaRequestDto {
  @ApiProperty({
    description: "Email Id of the user",
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  emailId: string;
}  

export interface AuthenticatedRequest extends Request {
  user: {
    preferred_username: string;
  };
}


