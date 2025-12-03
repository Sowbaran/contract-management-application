import { ObjectId, SchemaTypes, Types } from "mongoose";
import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsEmail,
  IsISO8601,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

class HeadcountPaginationDto {
  @ApiProperty({
    description: "Total number of rows available",
    example: 0,
  })
  totalRowCount: number;
}

class HeadcountMetaDto {
  @ApiProperty({
    description: "Pagination information",
    type: HeadcountPaginationDto,
  })
  pagination: HeadcountPaginationDto;
}

export class HeadcountFormListDto {
  @ApiProperty({
    description: "Unique identifier of the form",
    example: "673f2a34ac9471b25fdb5792",
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Module ID associated with the form",
    example: "65e3579de0ca70fe8f2e148e",
  })
  moduleId: Types.ObjectId;

  @ApiProperty({
    description: "Unique form code",
    example: "NRL-2024112106053799897",
  })
  code: string;

  @ApiProperty({
    description: "Form information object",
    type: IsObject,
    example: { role_name: "developer" },
  })
  formInfo: object;

  @ApiProperty({
    description: "Department identifier",
    example: "672acf6706b004004c729d08",
  })
  @IsString()
  @IsNotEmpty()
  department: Types.ObjectId;

  @ApiProperty({
    description: "Name of the department associated with the form",
    example: "Technology",
  })
  departmentName: string;

  @ApiProperty({
    description: "Workflow identifier",
    example: "65def3f1de3deddff04f79a7",
  })
  @IsString()
  @IsNotEmpty()
  workflow: Types.ObjectId;

  @ApiProperty({
    description: "Name of the workflow for the form",
    example: "CEO",
  })
  workflowName: string;

  @ApiProperty({
    description: "Current status of the form",
    example: "fulfilled",
  })
  status: string;

  @ApiProperty({
    description: "Email of the user who created the form",
    example: "bbharathivel@nrl.com.au",
  })
  @IsOptional()
  createdBy?: string;

  @ApiProperty({
    description: "Date when the form was created",
    example: "2024-11-21T12:40:20.340+00:00",
  })
  @IsOptional()
  createdAt?: string;
}

export class HeadcountFormListResponseDto {
  @ApiProperty({
    description: "Data array containing the forms",
    type: [HeadcountFormListDto],
  })
  data: HeadcountFormListDto[];

  @ApiProperty({
    description: "Meta data related to the response",
    type: HeadcountMetaDto,
  })
  meta: HeadcountMetaDto;
}

export class HeadcountGetFormDetailsQueryParamsDto {
  @ApiProperty({
    description: "id of the form",
    required: true,
    example: "675bc035952414810b9eab40",
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}

class FromHistory {
  @ApiProperty({
    description: "Email of the approver",
    example: "bbharathivel@nrl.com.au",
  })
  @IsEmail()
  @IsNotEmpty()
  approvedBy: string;

  @ApiProperty({
    description: "Current status of the workflow",
    example: "initiated",
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: "Workflow identifier",
    example: "65def3f1de3deddff04f79a7",
  })
  @IsString()
  @IsNotEmpty()
  workflow: Types.ObjectId;

  @ApiProperty({
    description: "Name of the workflow",
    example: "Executive General Manager",
  })
  @IsString()
  @IsNotEmpty()
  workflowName: string;

  @ApiProperty({
    description: "Department identifier",
    example: "672acf6706b004004c729d08",
  })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({
    description: "Name of the department",
    example: "Technology",
  })
  @IsString()
  @IsNotEmpty()
  departmentName: string;

  @ApiProperty({
    description: "Creation timestamp in milliseconds",
    example: "1732192820391",
  })
  @IsString()
  @IsNotEmpty()
  createdAt: string;
}

class WorkFlowOrder {
  @ApiProperty({
    description: "Level of the role in the workflow hierarchy",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  level: number;

  @ApiProperty({
    description: "Unique identifier for the role",
    example: "65def3f1de3deddff04f79a7",
  })
  @IsNotEmpty()
  roleId: Types.ObjectId;

  @ApiProperty({
    description: "Name of the role",
    example: "Executive General Manager",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Flag to indicate if a limit is applied",
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  limitFlag: boolean;

  @ApiProperty({
    description: "Minimum limit value (can be empty)",
    example: "",
  })
  @IsString()
  @IsOptional()
  min: string;

  @ApiProperty({
    description: "Maximum limit value",
    example: 250000,
  })
  @IsNumber()
  @IsNotEmpty()
  max: number;

  @ApiProperty({
    description: "Status of the role",
    example: "completed",
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}

class formAdditionalInfo {
  @ApiProperty({
    description: "Name of the finance partner",
    example: "Finance",
  })
  @IsString()
  @IsNotEmpty()
  finance_partner_name: string;

  @ApiProperty({
    description: "Indicates if the clearance is acceptable",
    example: "yes",
  })
  @IsString()
  @IsNotEmpty()
  clear_acceptable: string;

  @ApiProperty({
    description: "Indicates if tax is required",
    example: "no",
  })
  @IsString()
  @IsNotEmpty()
  tax_required: string;

  @ApiProperty({
    description: "Indicates if insurance is required",
    example: "yes",
  })
  @IsString()
  @IsNotEmpty()
  insurance_required: string;

  @ApiProperty({
    description: "Details if the expense is within the budget",
    example: "No costs incurred NRL",
  })
  @IsString()
  @IsNotEmpty()
  within_budget: string;

  @ApiProperty({
    description: "Indicates if there is an expenditure",
    example: "yes",
  })
  @IsString()
  @IsNotEmpty()
  expenditure: string;

  @ApiProperty({
    description: "Indicates if a commission is involved",
    example: "no",
  })
  @IsString()
  @IsNotEmpty()
  commission: string;

  @ApiProperty({
    description: "Additional comments, if any",
    example: "",
  })
  @IsString()
  @IsOptional()
  comments: string;

  @ApiProperty({
    description: "Indicates if the Head of PnC is the final approver",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isHeadOfPnCFinalApprover: boolean;
}

export class HeadcountFormDetailsDto {
  @ApiProperty({
    description: "Unique identifier of the form",
    example: "673f2a34ac9471b25fdb5792",
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Module ID associated with the form",
    example: "65e3579de0ca70fe8f2e148e",
  })
  moduleId: Types.ObjectId;

  @ApiProperty({
    description: "Unique form code",
    example: "NRL-2024112106053799897",
  })
  code: string;

  @ApiProperty({
    description: "Form information object",
    type: IsObject,
  })
  formInfo: object;

  @ApiProperty({
    description: "List of attachments related to the form",
    example: [
      "formdocuments/filesample_150kB_te_20241121T132148413Z_62048.pdf",
    ],
    type: [IsString],
  })
  attachments: string[];

  @ApiProperty({
    description: "History of the form",
    type: [FromHistory], // Array of history entries
  })
  formHistory: FromHistory[];

  @ApiProperty({
    description: "Department ID associated with the form",
    example: "672acf6706b004004c729d08",
  })
  department: string;

  @ApiProperty({
    description: "Name of the requester associated with the form",
    example: "BB",
  })
  requesterName: string;

  @ApiProperty({
    description: "Email of the requester associated with the form",
    example: "bbharathivel@nrl.com.au",
  })
  requesterEmail: string;

  @ApiProperty({
    description: "Workflow ID related to the form",
    example: "65def561de3deddff04f79ae",
  })
  workflow: string;

  @ApiProperty({
    description: "Name of the department associated with the form",
    example: "Technology",
  })
  departmentName: string;

  @ApiProperty({
    description: "Name of the workflow for the form",
    example: "CEO",
  })
  workflowName: string;

  @ApiProperty({
    description: "Workflow version ID",
    example: "65e6c40f1bc6174e00ce714b",
  })
  workflowVersion: Types.ObjectId;

  @ApiProperty({
    description: "Current status of the form",
    example: "fulfilled",
  })
  status: string;

  @ApiProperty({
    description: "Indicates if the form is active or not",
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: "List of workflow order IDs",
    type: [WorkFlowOrder],
  })
  workflowOrder: WorkFlowOrder[];

  @ApiProperty({
    description: "Module code associated with the form",
    example: "vendor-contract",
  })
  moduleCode: string;

  @ApiProperty({
    description: "Additional information specific to the form",
    type: formAdditionalInfo,
  })
  formAdditionalInfo: formAdditionalInfo;

  
  @ApiProperty({
    description: "Email of the user who created the form",
    example: "bbharathivel@nrl.com.au",
  })
  @IsOptional()
  createdBy?: string; 

  @ApiProperty({
    description: "Email of the user who updated the form",
    example: "bbharathivel@nrl.com.au",
  })
  @IsOptional()
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
  updatedAt?: Date;
}

class WorkFlowDetails {
  @ApiProperty({
    description: "Approval level",
    example: 1,
  })
  @IsNumber()
  level: number;

  @ApiProperty({
    description: "Role ID associated with this level",
    example: "65def3f1de3deddff04f79a7",
  })
  @IsNotEmpty()
  roleId: ObjectId;

  @ApiProperty({
    description: "Role name",
    example: "Executive General Manager",
  })
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Indicates if there is a limit flag",
    example: false,
  })
  @IsBoolean()
  limitFlag?: boolean;

  @ApiProperty({
    description: "Minimum limit for approval",
    example: 250000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  min?: number;

  @ApiProperty({
    description: "Maximum limit for approval",
    example: 100000,
  })
  @IsOptional()
  @IsNumber()
  max?: number;

  @ApiProperty({
    description: "Approval status",
    example: "completed",
  })
  @IsString()
  status?: string;
}

export class GetHeadcountFormDetailDto extends HeadcountFormDetailsDto {
  @ApiProperty({
    description: "Workflow details list",
    type: [WorkFlowDetails],
  })
  @IsArray()
  @IsOptional()
  workflowDetails: WorkFlowDetails[];
}

class FormHistoryDto {
  @ApiProperty({
    description: "Email of the user who approved the workflow",
    example: "sshanmugasundaram@nrl.com.au",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  approvedBy: string;

  @ApiProperty({
    description: "Current status of the workflow",
    example: "approved",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: "ID of the workflow",
    example: "65def477de3deddff04f79a8",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  workflow: string;

  @ApiProperty({
    description: "Name of the workflow",
    example: "Technology Admin",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  workflowName: string;

  @ApiProperty({
    description: "ID of the department",
    example: "672acf6706b004004c729d08",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({
    description: "Name of the department",
    example: "Technology",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  departmentName: string;

  @ApiProperty({
    description: "Timestamp when the record was created",
    example: 1732193541530,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  createdAt: number;

  @ApiProperty({
    description: "Comments about the workflow approval",
    example: "",
    required: false,
  })
  @IsString()
  @IsOptional()
  comments: string;
}

export class HeadcountFormHistroyResponseDto {
  @ApiProperty({
    description: "The data of the form history",
    type: [FormHistoryDto],
    example: [
      {
        approvedBy: "bbharathivel@nrl.com.au",
        status: "initiated",
        workflow: "65def3f1de3deddff04f79a7",
        workflowName: "Executive General Manager",
        department: "672acf6706b004004c729d08",
        departmentName: "Technology",
        createdAt: 1732192820391,
      },
    ],
    required: true,
  })
  data: FormHistoryDto[];
}

export class CreateHeadCountResponseDto {
  @ApiProperty({
    description: "Message indicating the result of the operation",
    example: "New Form has been created successfully",
  })
  message: string;

  @ApiProperty({
    description: "Details of the created form",
    type: HeadcountFormDetailsDto,
  })
  data: HeadcountFormDetailsDto;
}

export class GetHeadcountFormDetailResponseDto {
  @ApiProperty({
    description: "Form Detail found successfully",
    example: "Form Detail found successfully",
  })
  message: string;

  @ApiProperty({
    description: "Form Detail found successfully",
    type: GetHeadcountFormDetailDto,
  })
  data: GetHeadcountFormDetailDto;
}

export class UpdateHeadCountResponseDto {
  @ApiProperty({
    description: "Form has been resubmitted successfully!",
    example: "Form has been resubmitted successfully!",
  })
  message: string;
}
