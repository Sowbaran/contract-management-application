import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsObject,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from "class-validator";
import { ObjectId } from "mongoose";

export class UpdateFormApprovalDto {
  @ApiProperty({
    description: "ID of the module",
    required: true,
    example: "64e4567de12a6f23b6548c92",
  })
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @ApiProperty({
    description: "Email ID of the user approving or updating the form",
    required: true,
    example: "user@example.com",
  })
  @IsString()
  @IsNotEmpty()
  emailId: string;

  @ApiProperty({
    description: "ID of the form being approved",
    required: true,
    example: "64f6789bcde23a4567df8901",
  })
  @IsString()
  @IsNotEmpty()
  formId: ObjectId;

  @ApiProperty({
    description: "Comments or notes related to the update",
    required: false,
    example: "Approved by the manager for further processing.",
  })
  @IsString()
  @IsOptional()
  comments: string;

  @ApiProperty({
    description: "Approval status of the form",
    required: false,
    example: "approved",
  })
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty({
    description: "Flag indicating if additional access is required",
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isAdditionalAccess: boolean;

  @ApiProperty({
    description: "Additional information related to the form in object format",
    required: false,
    example: {
      key: "value",
      additionalNotes: "Some additional information.",
    },
  })
  @IsObject()
  @IsOptional()
  formAdditionalInfo: object;

  @ApiProperty({
    description: "Mail redirect path to be used for notifications",
    required: true,
    example: "/redirect/path",
  })
  @IsNotEmpty()
  mailRedirectPath: string;

  @ApiProperty({
    description: "Indicator for final approval by the head of PnC",
    required: false,
    example: true,
  })
  @IsOptional()
  isHeadOfPnCFinalApprover?: boolean;

  @ApiProperty({
    description: "Indicates esign is required for this contract",
    required: true,
    example: true,
  })
  @IsNotEmpty()
  eSignRequired: boolean;

  @ApiProperty({
    description: "Indicates witness for esign is required or not",
    required: true,
    example: true,
  })
  @IsNotEmpty()
  witnessFlag: boolean;

  @ApiProperty({
    description: "Name of the witness",
    required: false,
    example: "Varun",
  })
  @IsString()
  @IsOptional()
  witnessName?: string;

  @ApiProperty({
    description: "Name of the witness",
    required: false,
    example: "Vrameshbapu@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  witnessEmail?: string;
}

class SignerDto {
  @ApiProperty({
    description: "Name of the signer",
    example: "Sagar S",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Email of the signer",
    example: "sagarsrinivas94@gmail.com",
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Status of the signer (e.g., completed, declined)",
    example: "completed",
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: "The routing order for the signer in the signing process",
    example: "1",
  })
  @IsString()
  @IsNotEmpty()
  routingOrder: string;

  @ApiProperty({
    description: "Date and time the document was signed by the signer",
    example: "2024-09-11T05:14:29.903Z",
  })
  @IsString()
  @IsOptional()
  signedDateTime?: string;

  @ApiProperty({
    description: "Reason for the signer’s inclusion in the process",
    example: "sender",
  })
  @IsString()
  @IsNotEmpty()
  creationReason: string;
}

class DeclinedUserDto {
  @ApiProperty({
    description: "Email of the user who declined the envelope",
    example: "sagarsrinivas94+2@gmail.com",
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Name of the user who declined the envelope",
    example: "Sagar Srini",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Reason for declining the envelope",
    example: "Test decline reason",
  })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class EnvelopeDetailsDto {
  @ApiProperty({
    description: "Unique identifier for the envelope",
    example: "14ed4515-27ec-48e9-8c88-aa677827649f",
  })
  @IsString()
  @IsNotEmpty()
  envelopeId: string;

  @ApiProperty({
    description: "Status of the envelope",
    example: "envelope-completed",
  })
  @IsString()
  @IsNotEmpty()
  envelopeStatus: string;

  @ApiProperty({
    description: "List of signers involved in the envelope process",
    type: [SignerDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SignerDto)
  signers: SignerDto[];

  @ApiProperty({
    description: "Details of the user who declined the envelope, if applicable",
    type: DeclinedUserDto,
  })
  @ValidateNested()
  @Type(() => DeclinedUserDto)
  @IsOptional()
  declinedUser?: DeclinedUserDto;

  @ApiProperty({
    description:
      "The bucket name where the document needs to be updated by the signature servicee",
    example: "bucket-name",
  })
  @IsString()
  @IsNotEmpty()
  signedBucketName: string;

  @ApiProperty({
    description: "Dockey of the envelope",
    example: "14ed4515-27ec-48e9-8c88-aa677827649f",
  })
  @IsString()
  @IsNotEmpty()
  signedDocKey: string;
}

export class GetRetriggerQueryParamsDto {
  @ApiProperty({
    description: "ID of the module",
    required: true,
    example: "64e4567de12a6f23b6548c92",
  })
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @ApiProperty({
    description: "Email ID of the user approving or updating the form",
    required: true,
    example: "user@example.com",
  })
  @IsString()
  @IsNotEmpty()
  emailId: string;

  @ApiProperty({
    description:
      "The type of the form myRequest, teamRequest ,approveRequest, myApprovedRequest and myEsignRequest",
    example: "myRequest",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class GetRetriggerIdDto {
  @ApiProperty({
    description: "id of the form",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class GetEsignUrlQueryParamsDto {
  @ApiProperty({
    description: "ID of the module",
    required: true,
    example: "64e4567de12a6f23b6548c92",
  })
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @ApiProperty({
    description: "Email ID of the user approving or updating the form",
    required: true,
    example: "user@example.com",
  })
  @IsString()
  @IsNotEmpty()
  emailId: string;
} 

export interface AuthenticatedRequest extends Request {
  user: {
    preferred_username: string;
  };
}
