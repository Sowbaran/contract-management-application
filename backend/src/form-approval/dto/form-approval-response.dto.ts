import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class FormMessageDto {
  @ApiProperty({
    description: "Message related to the form",
    required: true,
    example: "Form approved successfully!",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class FormApprovalMessageDto {
  @ApiProperty({
    description: "Message related to the form",
    required: true,
    example: "Form approved successfully!",
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: "Signing url",
    required: true,
    example: "Form approved successfully!",
  })
  @IsString()
  @IsNotEmpty()
  signingUrl: string;
}

export class CallbackMessageDto {
  @ApiProperty({
    description: "Message related to the form",
    required: true,
    example: "Callback event envelope-completed  hit successfully",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class RetriggerResponseDto {
  @ApiProperty({
    description: "Message related to the retrigger",
    required: true,
    example:
      "E-sign Resend Successfully! You will soon receive an email from DocuSign to sign the agreement. Please check your inbox!",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
