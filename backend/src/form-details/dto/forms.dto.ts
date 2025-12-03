import { ObjectId, SchemaTypes, Types } from "mongoose";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEmail,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

class GetDropDownResponse {
  @ApiProperty({
    description: "Id of the user",
    example: " 677d567870dc1af598b322a7",
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    description: "Name of the user",
    example: " Adam",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateUpdateFormResponseDto {
  @ApiProperty({
    description: "Message indicating the result of the operation",
    example: "Form has been created/resubmitted successfully!",
  })
  message: string;
}

export class CreateDraftFormResponseDto {
  @ApiProperty({
    description: "Message indicating the result of the operation",
    example: "Draft Form has been created successfully!",
  })
  message: string;
}
export class FilterMetaResponseDto {
  @ApiProperty({
    description: "Status of the users allowed to do permission",
    example: ["pending", "completed", "rejected"],
  })
  @IsArray()
  @IsOptional()
  status: string[];

  @ApiProperty({
    description: "Workflow order for the user",
    example: [
      {
        _id: "65def3f1de3deddff04f79a7",
        name: "Executive General Manager",
      },
      {
        _id: "65def477de3deddff04f79a8",
        name: "Technology Admin",
      },
    ],
  })
  @IsArray()
  @IsOptional()
  workflow: GetDropDownResponse[];

  @ApiProperty({
    description: "Workflow order for the user",
    example: [
      {
        _id: "65e391006d98432f2ac48ab8",
        name: "Risk, Legal and Integrity",
      },
      {
        _id: "65e391c36d98432f2ac48abd",
        name: "Finance",
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  department: GetDropDownResponse[];
}

export class FileterMetaRequestDto {
  @ApiProperty({
    description: "Email ID of the user",
    required: true,
    example: "user@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  emailId: string;

  @ApiProperty({
    description: "Type of the item",
    required: true,
    example: "myRequest",
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: "Module ID associated with the item",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  moduleId: string;
}

export class GetResetQueryParamsDto {
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
    description: "type of request",
    required: true,
    example: "myRequest",
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class GetResetIdDto {
  @ApiProperty({
    description: "id of the form",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class ResetResponseDto {
  @ApiProperty({
    description: "Message related to the retrigger",
    required: true,
    example: "The form has been Reset successfully",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class GetDeleteQueryParamsDto {
  @ApiProperty({
    description: "ID of the module",
    required: true,
    example: "64e4567de12a6f23b6548c92",
  })
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @ApiProperty({
    description: "comments for deleting the form",
    required: true,
    example: "The monetory value is not reasonable",
  })
  @IsString()
  @IsOptional()
  comments?: string;
}

export class DeleteResponseDto {
  @ApiProperty({
    description: "Message related to the retrigger",
    required: true,
    example: "Form has been successfully deactivated",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class GetRecallQueryParamsDto {
  @ApiProperty({
    description: "ID of the module",
    required: true,
    example: "64e4567de12a6f23b6548c92",
  })
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @ApiProperty({
    description: "comments for recalling the function",
    required: true,
    example: "The monetory value is not adequate",
  })
  @IsString()
  @IsNotEmpty()
  comments: string; 

  @ApiProperty({
    description: "email of the user who is recalling the form",
    required: true,
    example: "vrameshbapu@nrl.com.au",
  })
@IsString()
@IsNotEmpty()
emailId: string;

}

export class RecallResponseDto {
  @ApiProperty({
    description: "Message related to the recall",
    required: true,
    example: "The form has been successfully recalled and all users have been notified.",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class GetGmUserQueryParamsDto {
  @ApiProperty({
    description: "ID of the module",
    required: true,
    example: "64e4567de12a6f23b6548c92",
  })
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @ApiProperty({
    description: "email of the user",
    required: true,
    example: "vrameshbapu@nrl.com.au",
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "id of the department",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsString()
  @IsNotEmpty()
  deptId: string;
}
export class GMDetailsDto {
  @ApiProperty({
    example: "65e3f9bde1ca7af2e142b9c7",
    description: "Unique identifier of the user",
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: "John Doe",
    description: "Full name of the user",
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    example: "john.doe@example.com",
    description: "Email address of the user",
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class GMDetailsResponseDto { 
  @ApiProperty({
    description: "Message indicating the result of the operation",
    example: "GM users are retrived!",
  })
  message: string;

  @ApiProperty({
    description: "List of General Manager Users",
    type: [GMDetailsDto],
  })
  data: GMDetailsDto[];
}

export class GMErrorResponseDto {
  @ApiProperty({
    example: "No user with the role 'general-manager' is available",
    description: "Error message when no general manager is found",
  })
  @IsString()
  @IsNotEmpty()
  error: string;
}
