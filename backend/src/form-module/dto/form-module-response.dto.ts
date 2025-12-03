import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class FormModuleResponseDto {
  @ApiProperty({
    description: "Id of the Module",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsNotEmpty()
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Name of the form Module",
    required: true,
    example: "contract",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "code of the form Module",
    required: true,
    example: "contract",
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: "Descripton of the form Module",
    required: true,
    example: "Vendor Contract",
  })
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({
    description: "status of Module",
    required: true,
    example: "true",
  })
  @IsString()
  @IsNotEmpty()
  status?: boolean;

  @ApiProperty({
    description: "User who created the module",
    required: true,
    example: "vrameshbapu.nrl.com.au",
  })
  createdBy?: string;

  @ApiProperty({
    description: "User who updated the module",
    required: false,
    example: "vrameshbapu.nrl.com.au",
  })
  updatedBy?: string;

  @ApiProperty({
    description: "Date and time when the module is been created ",
    required: true,
    example: "2024-03-02T16:45:17.346+00:00",
  })
  createdAt?: Date;

  @ApiProperty({
    description: "Date and time when the module is been updated",
    required: false,
    example: "2024-03-02T16:45:17.346+00:00",
  })
  updateAt?: Date;
}

export class UpdateFormModuleResponseDto {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: "Form Module has been successfully updated",
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: "The updated Form Module data",
    type: FormModuleResponseDto,
  })
  @IsNotEmpty()
  data: FormModuleResponseDto;
}

export class GetModuleByIdResponseDto {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: "Form Module found successfully",
  })
  message: string;

  @ApiProperty({
    description: "The data returned by the operation",
    type: FormModuleResponseDto,
  })
  data: FormModuleResponseDto | null;
}

export class PermissionModuleResponseDto {
  @ApiProperty({
    description: "Id of the permission",
    example: " 677d567870dc1af598b322a7",
  })
  @IsString()
  @IsNotEmpty()
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Name of the permission",
    example: "Contract",
  })
  @IsString()
  @IsNotEmpty()
  permissionName: string;
}

class FormModuleDropDownResponseDto {
  @ApiProperty({
    description: "Id of the Module",
    required: true,
    example: "65e3579de0ca70fe8f2e148e",
  })
  @IsNotEmpty()
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Name of the form Module",
    required: true,
    example: "contract",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Name of the module",
    type: [PermissionModuleResponseDto],
  })
  @IsArray()
  @IsNotEmpty()
  permissions: PermissionModuleResponseDto[];
}

export class GetAllModulesResponseDto {
  @ApiProperty({
    description: "Message describing the result of the operation",
    example: "Form Module found successfully",
  })
  message: string;

  @ApiProperty({
    description: "The data returned by the operation",
    type: [FormModuleDropDownResponseDto],
  })
  data: FormModuleDropDownResponseDto[];
}

class MetaDto {
  @ApiProperty({
    description: "Total number of rows available",
    required: true,
    example: 10,
  })
  totalRowCount: number;
}

export class GetAllFormModuleResponseDto {
  @ApiProperty({
    description: "list of Form Modules",
    required: true,
    type: [FormModuleResponseDto],
  })
  data: FormModuleResponseDto[];

  @ApiProperty({
    description: "Meta information",
    required: true,
  })
  meta: MetaDto;
}

export class CreateUpdateModuleResponseDto {
  @ApiProperty({
    description: "Module data created successfully",
    example: "The Form Module has been successfully created/deleted.",
  })
  message: string;
}
