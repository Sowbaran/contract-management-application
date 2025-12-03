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
  isObject,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
class ContractPaginationDto {
  @ApiProperty({
    description: "Total number of rows available",
    example: 0,
  })
  totalRowCount: number;
}

class ContractMetaDto {
  @ApiProperty({
    description: "Pagination information",
    type: ContractPaginationDto,
  })
  pagination: ContractPaginationDto;
}

export class ContractFormListDto {
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
    example: {
      counter_party: "NRL-TechHub",
      monetary_value: "20000.50",
      start_date: "Sun Nov 28 202421 10:38:27 GMT+0530 ",
      end_date: "Sun Nov 28 202421 10:38:27 GMT+0530 ",
    },
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

export class ContractFormListResponseDto {
  @ApiProperty({
    description: "Data array containing the forms",
    type: [ContractFormListDto],
  })
  data: ContractFormListDto[];

  @ApiProperty({
    description: "Meta data related to the response",
    type: ContractMetaDto,
  })
  meta: ContractMetaDto;
}

export class ContractGetFormDetailsQueryParamsDto {
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

class EnvelopeSummary {
  @ApiProperty({
    description: "Unique identifier for the envelope",
    example: "b6056961-d0b9-4f84-8c66-7aa1a3d39afe",
  })
  @IsString()
  @IsNotEmpty()
  envelopeId: string;

  @ApiProperty({
    description: "Current status of the envelope",
    example: "sent",
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: "Timestamp of the status update in ISO8601 format",
    example: "2024-11-21T13:29:41.6730000Z",
  })
  @IsISO8601()
  @IsNotEmpty()
  statusDateTime: string;

  @ApiProperty({
    description: "URI of the envelope resource",
    example: "/envelopes/b6056961-d0b9-4f84-8c66-7aa1a3d39afe",
  })
  @IsString()
  @IsNotEmpty()
  uri: string;
}

export class FormDetailsDto {
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
    description: "List of MSA attachments",
    example: [
      "msadocuments/file_sam_ple_150kB__20241121T124014426Z_23514.pdf",
      "approverSignedMSADocument/file_sam_ple_150kB__20241121T124014426Z_2351…",
    ],
    type: [IsString], // Adjust based on MSA attachment structure
  })
  msaAttachments: string[];

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
    description: "Name of the requester associated with the form",
    example: "mohan",
  })
  requesterName: string;

  @ApiProperty({
    description: "Email of the requester associated with the form",
    example: "bbharathivel@nrl.com.au",
  })
  requesterEmail: string;

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
    description: "Current status of the form in DocuSign",
    example: "envelope-completed",
  })
  docusignStatus: string;

  @ApiProperty({
    description: "Unique envelope ID from DocuSign",
    example: "b6056961-d0b9-4f84-8c66-7aa1a3d39afe",
  })
  envelopeId: string;

  @ApiProperty({
    description: "Summary information of the envelope",
    type: EnvelopeSummary,
  })
  envelopeSummary: EnvelopeSummary;

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

export class GetFormDetailDto extends FormDetailsDto {
  @ApiProperty({
    description: "Indicates if additional access is enabled",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isAdditionalAccess: boolean;

  @ApiProperty({
    description: "Indicates if the MSA flag is set",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  MSAflag: boolean;

  @ApiProperty({
    description: "Workflow details list",
    type: [WorkFlowDetails],
  })
  @IsArray()
  @IsOptional()
  workflowDetails: WorkFlowDetails[];

  @ApiProperty({
    description:
      "Indicates if the workflow is in the last approver table or not",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isFinalApprover: boolean;

  @ApiProperty({
    description:
      "This flag is used to find the contract has to be moved to draft or not",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isRecallFlag: boolean;

  @ApiProperty({
    description: "This flag is used to esign is required or not",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  eSignRequired: boolean;

  @ApiProperty({
    description: "This flag is used to find out workflow can be reset or not",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isWorkflowReset: boolean;

  @ApiProperty({
    description:
      "This flag is used to find out docusign has to be retriggered or not",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isDocuSignRetrigger: boolean;

  @ApiProperty({
    description: "Current status of the workflow",
    example: {
      userId: "678e14daca332048be97fa69",
      name: "Varunkumar Rameshbapu",
      email: "vrameshbapu@nrl.com.au",
      roleName: "First Reviewer",
      roleId: "676435d455a50e076bedab81",
      roleCode: "first-reviewer",
    },
    required: false,
  })
  @IsOptional()
  specificApproverDetails?: object;

  @ApiProperty({
    description: "version of the form",
    example: "V2",
  })
  @IsString()
  version: string; 

  @ApiProperty({
    description: "This describes the the singing is required or not",
    example: "Expenditure no contract for signing",
  })
  @IsString()
  approvalBeingSought: string; 

  @ApiProperty({
    description:
      "This flag is used to find out edit button to be showed or not",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isFirstReviewerEditFlag: boolean;
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

export class FormHistroyResponseDto {
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

export class GetFormDetailResponseDto {
  @ApiProperty({
    description: "Form Detail found successfully",
    example: "Form Detail found successfully",
  })
  message: string;

  @ApiProperty({
    description: "Form Detail found successfully",
    type: GetFormDetailDto,
  })
  data: GetFormDetailDto;
}

class FormInfo {
  @ApiProperty({
    description: "Name of the requester",
    example: "Mohan Murugesan",
  })
  requester_name: string;

  @ApiProperty({
    description: "Email of the requester",
    example: "bbharathivel@nrl.com.au",
  })
  requester_email: string;

  @ApiProperty({
    description: "Name of the department",
    example: "Technology",
  })
  departmentName: string;

  @ApiProperty({
    description:
      "Indicates whether the requester is within the contract authority limit",
    example: "Yes",
  })
  is_contract_authority_limit: string;

  @ApiProperty({
    description: "The business case description",
    example:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.",
  })
  business_case: string;

  @ApiProperty({
    description: "The NRL entity involved in the contract",
    example: "Australian Rugby League Commission Limited ACN 003 107 293",
  })
  nrl_entity: string;

  @ApiProperty({
    description: "Counter party in the contract",
    example: "Counter Party 1",
  })
  counter_party: string;

  @ApiProperty({
    description: "Description of the agreement",
    example:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.",
  })
  desc_agreement: string;

  @ApiProperty({
    description: "Term length of the contract",
    example: "12 months",
  })
  term: string;

  @ApiProperty({
    description: "Start date of the contract",
    example: "Thu Dec 19 2024 18:05:37 GMT+0530 (India Standard Time)",
  })
  start_date: string;

  @ApiProperty({
    description: "End date of the contract",
    example: "Fri Jan 24 2025 18:05:37 GMT+0530 (India Standard Time)",
  })
  end_date: string;

  @ApiProperty({
    description: "Monetary value of the contract",
    example: 250000,
  })
  monetary_value: number;

  @ApiProperty({
    description: "Termination clause description",
    example:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.",
  })
  termination: string;

  @ApiProperty({
    description: "Reputational risk description",
    example:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.",
  })
  reputational_risk: string;

  @ApiProperty({
    description: "Special or unusual conditions in the contract",
    example:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.",
  })
  special_or_unusual: string;

  @ApiProperty({
    description: "Indicates whether the transaction is at arm’s length",
    example: "Yes",
  })
  arms_length_transact: string;

  @ApiProperty({
    description:
      "Indicates whether the counterparty is a contract counterparty",
    example: "Yes",
  })
  contract_counterparty: string;

  @ApiProperty({
    description: "Indicates whether the contract includes a contract form",
    example: "Yes",
  })
  include_contract_form: string;

  @ApiProperty({
    description: "Indicates whether a supplier code should be provided",
    example: "No",
  })
  provide_supplier_code: string;

  @ApiProperty({
    description: "Indicates whether the contract is capital expenditure",
    example: "No",
  })
  is_capital_expenditure: string;
}
