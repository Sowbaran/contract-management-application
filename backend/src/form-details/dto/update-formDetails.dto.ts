import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsObject,
  IsOptional,
  IsArray,
} from "class-validator";
import { ObjectId } from "mongoose";

export class UpdateFormDetailsDto {
  @ApiProperty({
    description: "ID of the form being updated",
    required: true,
    example: "65f47c35de3deddff04f79c1",
  })
  @IsString()
  @IsNotEmpty()
  formId: ObjectId;

  @ApiProperty({
    description: "Module ID",
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsOptional()
  moduleId: string;

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
  @IsString()
  @IsOptional()
  department: string;

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
    description: "Email of the user who updated the form",
    example: "bbharathivel@nrl.com.au",
  })
  @IsString()
  @IsOptional()
  updatedBy: string;

  @ApiProperty({
    description: "Redirect path for email notifications",
    example:
      "/finance/vendor-contract/requests/detail/formDetailId?page=approveRequest&moduleId=65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsOptional()
  mailRedirectPath: string;
}
