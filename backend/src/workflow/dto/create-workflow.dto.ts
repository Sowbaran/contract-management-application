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
import { AbstractSchema } from "@app/common";
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

  @ApiProperty({
    description: "User who created this record",
    example: "bbharathivel@nrl.com.au",
  })
  @IsOptional()
  @IsString()
  createdBy: string;

  @ApiProperty({
    description: "User who update this record",
    example: "bbharathivel@nrl.com.au"
  })
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

export class WorkflowDto {
  @ApiProperty({
    description: "Id of the workflow",
    required: true,
    example: "65e6c40f1bc6174e00ce714b",
  })
  @IsString()
  @IsNotEmpty()
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
  workflowOrder: workflowOrdertDTO[];

  @ApiProperty({
    description: "Order of the workflow",
    required: false,
    example: "bala@nrl.com.au",
  })
  @IsOptional()
  @IsString()
  createdBy: string;

  @ApiProperty({
    description: "Order of the workflow",
    required: false,
    example: "bala@nrl.com.au",
  })
  @IsOptional()
  @IsString()
  updatedBy: string;

  @ApiProperty({
    description: "Status of the workflow",
    required: false,
    example: "true",
  })
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    description: "Date and time when the workflow has been created ",
    required: true,
    example: "2024-03-02T16:45:17.346+00:00",
  })
  createdAt?: Date;

  @ApiProperty({
    description: "Date and time when the workflow has been updated",
    required: false,
    example: "2024-03-02T16:45:17.346+00:00",
  })
  updateAt?: Date;
}

export class WorkflowResponseDto {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: " All workflow data found successfully",
  })
  message: string;

  @ApiProperty({
    description: "The data returned by the operation",
    type: WorkflowDto,
    example: {
      summary: "Sample Workflow Response",
      value: {
        moduleId: "65e3579de0ca70fe8f2e148e",
        version: 1,
        workflowOrder: [
          {
            level: 1,
            role: "676435d455a50e076bedab81",
            limitFlag: true,
            min: 0,
            max: 100,
            isSpecificDeptApprover: false,
            includeOnRequesterCheck: true,
            code: "first-reviewer",
            name: "First Reviewer",
          },
        ],
        createdBy: "user123",
        updatedBy: "user456",
        status: true,
        createdAt: "2024-03-02T16:45:17.346+00:00",
        updateAt: "2024-03-03T10:20:00.000+00:00",
      },
    },
  })
  data: WorkflowDto;
}

export class WorkflowByMouduleIdResponseDto {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: " All workflow data found successfully",
  })
  message: string;

  @ApiProperty({
    description: "The data returned by the operation",
    type: [WorkflowDto],
    example: [
      {
        summary: "Sample Workflow Response",
        value: {
          _id: "65e3579de0ca70fe8f2e148e",
          moduleId: "65e3579de0ca70fe8f2e148e",
          version: 1,
          workflowOrder: [
            {
              level: 1,
              role: "676435d455a50e076bedab81",
              limitFlag: true,
              min: 0,
              max: 100,
              isSpecificDeptApprover: false,
              includeOnRequesterCheck: true,
              code: "first-reviewer",
              name: "First Reviewer",
            },
          ],
          createdBy: "user123",
          updatedBy: "user456",
          status: true,
          createdAt: "2024-03-02T16:45:17.346+00:00",
          updateAt: "2024-03-03T10:20:00.000+00:00",
        },
      },
    ],
  })
  data: WorkflowDto[];
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

export class CreateUpdateWorkflowResponseDto {
  @ApiProperty({
    description: "Workflow data created successfully",
    example: "The Workflow has been successfully created/updated/deleted.",
  })
  message: string;
}

export class GetWorkflowListRequestDto {

   @ApiProperty({
      description: "Email address of the user",
      example: "bbharathivel@nrl.com.au",
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
