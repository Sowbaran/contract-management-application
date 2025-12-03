import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsEmail,
} from "class-validator";
import { ObjectId, Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class workflowOrdertDTO {
  @ApiProperty({
    description: "id of the workflow order for frontend purpose",
    required: false,
    example: "676435d455a50e076bedab81",
  })
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({
    description: "level of the workflow order",
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  level: number;

  @ApiProperty({
    description: "role of the workflow order",
    required: false,
    example: "676435d455a50e076bedab81",
  })
  @IsString()
  @IsNotEmpty()
  role: ObjectId;

  @ApiProperty({
    description: "limit flag of the workflow order",
    required: false,
    example: "true",
  })
  @IsBoolean()
  @IsOptional()
  limitFlag: boolean;

  @ApiProperty({
    description: "min number of the workflow order",
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  min: number;

  @ApiProperty({
    description: "max number of the workflow order",
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  max: number;

  @ApiProperty({
    description: "Specific Department Approver",
    required: false,
    example: "true",
  })
  @IsBoolean()
  @IsOptional()
  isSpecificDeptApprover: boolean;

  @ApiProperty({
    description: "Include On Requester Check",
    required: false,
    example: "true",
  })
  @IsBoolean()
  @IsOptional()
  includeOnRequesterCheck: boolean; 

  @ApiProperty({
    description: "If it is true then only legal and cfo workflow will be added",
    required: false,
    example: "true",
  })
  @IsBoolean()
  @IsOptional()
  deedOfNovation: boolean; 

  @ApiProperty({
    description: "If it is true, then we can bypass the technology admin workflow",
    required: false,
    example: "true",
  })
  @IsBoolean()
  @IsOptional()
  byPassWorkflow: boolean;

  @ApiProperty({
    description: "Code of the workflow order",
    required: false,
    example: "first-reviewer",
  })
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty({
    description: "name of the workflow order",
    required: false,
    example: "First Reviewer",
  })
  @IsString()
  @IsOptional()
  name: string;
}
export class CreateWorkflowDto {
  @ApiProperty({
    description: "Id of the workflow",
    required: true,
    example: "65e6c40f1bc6174e00ce714b",
  })
  @IsString()
  @IsOptional()
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Id of the moduleId",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  moduleId: Types.ObjectId;

  @ApiProperty({
    description: "Version Number",
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  version: number;

  @ApiProperty({
    description: "Order of the workflow",
    required: false,
    type: [workflowOrdertDTO],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => workflowOrdertDTO)
  workflowOrder: workflowOrdertDTO[];

  @IsOptional()
  @IsString()
  createdBy: string;

  @IsOptional()
  @IsString()
  updatedBy: string;

  @ApiProperty({
    description: "Status of the workflow",
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  status: boolean;
}

export class UpdateWorkflowIdDto {
  @ApiProperty({
    description: "id of the workflow",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  id: string;
}

export class GetIdByParamsDto {
  @ApiProperty({
    description: "id of the workflow",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class GetModuleIdByParamsDto {
  @ApiProperty({
    description: "id of the module",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  moduleId: string;
}

export class GetWorkflowListRequestDto {
  @ApiProperty({
    description: "Email address of the user",
    example: "mmurugesan@nrl.com.au",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Id of the Module",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsOptional()
  menuModuleId: string;
} 

export interface AuthenticatedRequest extends Request {
  user: {
    preferred_username: string;
  };
}
