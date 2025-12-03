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

export class workflowOrderDTO {
  @ApiProperty({
    description: "The level of the workflow order",
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  level: number;

  @ApiProperty({
    description: "The ID of the role associated with this workflow order",
    required: false,
    example: "65def586de3deddff04f79af",
  })
  @IsString()
  @IsOptional()
  roleId: ObjectId;

  @ApiProperty({
    description: "Flag indicating whether there is a limit in this workflow",
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  limitFlag: boolean;

  @ApiProperty({
    description: "The minimum value for this workflow order",
    required: false,
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  min: number;

  @ApiProperty({
    description: "The maximum value for this workflow order",
    required: false,
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  max: number;

  @ApiProperty({
    description: "Name of the workflow order",
    required: false,
    example: "General Manager",
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: "Status of the workflow order",
    required: true,
    example: "active",
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description:
      "Flag indicating whether a specific department approver is required",
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isSpecificDeptApprover: boolean;

  @ApiProperty({
    description:
      "Flag indicating whether the workflow should include requester checks",
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  includeOnRequesterCheck: boolean;
}

export class CreateFormDto {
  @ApiProperty({
    description: "ID of the form being updated",
    required: false,
    example: "65f47c35de3deddff04f79c1",
  })
  @IsString()
  @IsOptional()
  formId: ObjectId;

  @ApiProperty({
    description: "Module ID",
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsNotEmpty()
  moduleId: Types.ObjectId;

  @ApiProperty({
    description: "Code for the transaction",
    example: "NRL-2025011709394366241",
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: "Department ID",
    example: "672acf6706b004004c729d08",
  })
  @IsNotEmpty()
  department: Types.ObjectId;

  @ApiProperty({
    description: "Name of the department",
    example: "Technology",
  })
  @IsString()
  @IsNotEmpty()
  departmentName: string;

  @ApiProperty({
    description: "Information about the form",
    type: IsObject,
  })
  @IsNotEmpty()
  formInfo: object;

  @ApiProperty({
    description: "List of attachments",
    example: [
      "formdocuments/SSTNRL_Leave_policy_20250117T041228100Z_36346.pdf",
    ],
  })
  @IsArray()
  @IsNotEmpty()
  attachments: string[];

  @ApiProperty({
    description: "List of MSA attachments",
    example: ["msadocuments/SSTNRL_Leave_policy_20250117T041210343Z_40421.pdf"],
  })
  @IsArray()
  @IsNotEmpty()
  msaAttachments: string[];

  @ApiProperty({
    description: "Email of the user who created the form",
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  createdBy: string;

  @ApiProperty({
    description: "Email of the user who created the form",
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  updatedBy: string;

  @ApiProperty({
    description: "History of the form",
    type: [IsObject],
  })
  @IsArray()
  @IsNotEmpty()
  formHistory: object[];

  @ApiProperty({
    description: "Redirect path for email notifications",
    example:
      "/finance/vendor-contract/requests/detail/formDetailId?page=approveRequest&moduleId=65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  mailRedirectPath: string;

  @ApiProperty({
    description: "ID of the workflow associated with the form",
    required: false,
    example: "65def477de3deddff04f79a8",
  })
  @IsString()
  @IsOptional()
  workflow: Types.ObjectId;

  @ApiProperty({
    description: "Name of the workflow",
    required: false,
    example: "Technology Admin Workflow",
  })
  @IsString()
  @IsOptional()
  workflowName: string;

  @ApiProperty({
    description: "Version ID of the workflow",
    required: false,
    example: "65def477de3deddff04f79b2",
  })
  @IsOptional()
  workflowVersion: Types.ObjectId;

  @ApiProperty({
    description: "Workflow order details",
    required: false,
    type: [workflowOrderDTO],
    example: [
      {
        level: 1,
        roleId: "65def586de3deddff04f79af",
        limitFlag: true,
        min: 1,
        max: 100,
        name: "Manager",
        status: "active",
        isSpecificDeptApprover: true,
        includeOnRequesterCheck: false,
      },
    ],
  })
  @IsArray()
  @IsOptional()
  workflowOrder: workflowOrderDTO[];

  @ApiProperty({
    description: "Indicates if there is a active form",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  active: boolean;

  @ApiProperty({
    description: "Status of the form",
    required: false,
    example: "pedning",
  })
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty({
    description: "Envelope ID for document signing",
    required: false,
    example: "env_123456789",
  })
  @IsString()
  @IsOptional()
  envelopeId: string;

  @ApiProperty({
    description: "Code of the module",
    required: false,
    example: "MOD-IT-2025",
  })
  @IsString()
  @IsOptional()
  moduleCode: string;

  @ApiProperty({
    description: "Additional information for the form",
    required: false,
    example: { priority: "high", category: "IT" },
  })
  @IsOptional()
  formAdditionalInfo: object;

  @ApiProperty({
    description: "Envelope summary details",
    required: false,
    example: { status: "signed", documentName: "contract.pdf" },
  })
  @IsOptional()
  envelopeSummary: object;

  @ApiProperty({
    description: "Status of the DocuSign envelope",
    required: false,
    example: "completed",
  })
  @IsOptional()
  docusignStatus: string; 

  @ApiProperty({
    description: "User id of the specific user",
    required: false,
    example: "678e14daca332048be97fa69",
  })
  @IsString()
  @IsOptional()
  specificApproverUserId: string;
}

export class CreateDraftFormDto {
  @ApiProperty({
    description: "ID of the form being updated",
    required: false,
    example: "65f47c35de3deddff04f79c1",
  })
  @IsString()
  @IsOptional()
  formId: ObjectId;

  @ApiProperty({
    description: "Module ID",
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsOptional()
  moduleId: Types.ObjectId;

  @ApiProperty({
    description: "Code for the transaction",
    example: "NRL-2025011709394366241",
  })
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty({
    description: "Department ID",
    example: "672acf6706b004004c729d08",
  })
  @IsOptional()
  department: Types.ObjectId;

  @ApiProperty({
    description: "Name of the department",
    example: "Technology",
  })
  @IsString()
  @IsOptional()
  departmentName: string;

  @ApiProperty({
    description: "Information about the form",
    type: IsObject,
  })
  @IsOptional()
  formInfo: object;

  @ApiProperty({
    description: "List of attachments",
    example: [
      "formdocuments/SSTNRL_Leave_policy_20250117T041228100Z_36346.pdf",
    ],
  })
  @IsArray()
  @IsOptional()
  attachments: string[];

  @ApiProperty({
    description: "List of MSA attachments",
    example: ["msadocuments/SSTNRL_Leave_policy_20250117T041210343Z_40421.pdf"],
  })
  @IsArray()
  @IsOptional()
  msaAttachments: string[];

  @ApiProperty({
    description: "Email of the user who created the form",
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  createdBy: string;

  @ApiProperty({
    description: "Email of the user who created the form",
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  updatedBy: string;

  @ApiProperty({
    description: "History of the form",
    type: [IsObject],
  })
  @IsArray()
  @IsOptional()
  formHistory: object[];

  @ApiProperty({
    description: "Redirect path for email notifications",
    example:
      "/finance/vendor-contract/requests/detail/formDetailId?page=approveRequest&moduleId=65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsOptional()
  mailRedirectPath: string;

  @ApiProperty({
    description: "ID of the workflow associated with the form",
    required: false,
    example: "65def477de3deddff04f79a8",
  })
  @IsString()
  @IsOptional()
  workflow: Types.ObjectId;

  @ApiProperty({
    description: "Name of the workflow",
    required: false,
    example: "Technology Admin Workflow",
  })
  @IsString()
  @IsOptional()
  workflowName: string;

  @ApiProperty({
    description: "Version ID of the workflow",
    required: false,
    example: "65def477de3deddff04f79b2",
  })
  @IsOptional()
  workflowVersion: Types.ObjectId;

  @ApiProperty({
    description: "Workflow order details",
    required: false,
    type: [workflowOrderDTO],
    example: [
      {
        level: 1,
        roleId: "65def586de3deddff04f79af",
        limitFlag: true,
        min: 1,
        max: 100,
        name: "Manager",
        status: "active",
        isSpecificDeptApprover: true,
        includeOnRequesterCheck: false,
      },
    ],
  })
  @IsArray()
  @IsOptional()
  workflowOrder: workflowOrderDTO[];

  @ApiProperty({
    description: "Indicates if there is a active form",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  active: boolean;

  @ApiProperty({
    description: "Status of the form",
    required: false,
    example: "draft",
  })
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty({
    description: "Code of the module",
    required: false,
    example: "MOD-IT-2025",
  })
  @IsString()
  @IsOptional()
  moduleCode: string; 

  @ApiProperty({
    description: "User id of the specific user",
    required: false,
    example: "678e14daca332048be97fa69",
  })
  @IsString()
  @IsOptional()
  specificApproverUserId: string;
}

export class ContractRequestQueryDto {
  @ApiProperty({
    description:
      "The type of the form myRequest, teamRequest approveRequest, myApprovedRequest and myEsignRequest",
    example: "myRequest",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: "Module ID associated with the form",
    example: "65e3579de0ca70fe8f2e148e",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  moduleId: string;
}

export class ContractGetFormListParamsDto {
  @ApiProperty({
    description: "email of the user",
    required: true,
    example: "mmurugesan@nrl.com.au",
  })
  @IsString()
  @IsNotEmpty()
  email: string;
} 

export interface AuthenticatedRequest extends Request {
  user: {
    preferred_username: string;
    name:string;
  };
}
