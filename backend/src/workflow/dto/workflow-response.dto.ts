import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsBoolean } from "class-validator";
import { Types } from "mongoose";
import { workflowOrdertDTO } from "./workflow-request.dto";

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
            deedOfNovation: false,
            byPassWorkflow: false,
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
              deedOfNovation:true,
              byPassWorkflow:true,
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

export class CreateUpdateWorkflowResponseDto {
    @ApiProperty({
      description: "Workflow data created successfully",
      example: "The Workflow has been successfully created/updated/deleted.",
    })
    message: string;
  } 

  export class DeleteWorkflowResponseDto {
    @ApiProperty({
      description: "Workflow has been successfully deleted",
      example: "Workflow has been successfully deleted.",
    })
    message: string;
  }