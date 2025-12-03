import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from "class-validator";
import { Types } from "mongoose";

export class PermissionResponseDto {
  @ApiProperty({
    description: "Id of the Permission",
    example: " 677d567870dc1af598b322a7",
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    description: "Id of the Permission",
    required: true,
    example: "67724451c6fdbee05f9644f8",
  })
  @IsString()
  @IsNotEmpty()
  readonly moduleId: Types.ObjectId;

  @ApiProperty({
    description: "Premission code",
    required: true,
    example: "view-Contract-request",
  })
  @IsString()
  @IsNotEmpty()
  readonly permissionCode: string;

  @ApiProperty({
    description: "Premission name",
    required: true,
    example: "view-Contract-request",
  })
  @IsString()
  @IsNotEmpty()
  readonly permissionName: string;

  @ApiProperty({
    description: "Module code",
    required: true,
    example: "contract",
  })
  @IsString()
  @IsNotEmpty()
  readonly moduleCode: string;

  @ApiProperty({
    description: "Module name",
    required: true,
    example: "contract",
  })
  @IsString()
  @IsNotEmpty()
  readonly moduleName: string;

  @ApiProperty({
    description: "description of the module ",
    required: true,
    example: "Allows access to module settings page",
  })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({
    description: "Status of permission ",
    required: true,
    example: "true",
  })
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    description: "Status of module ",
    required: true,
    example: "true",
  })
  @IsOptional()
  @IsBoolean()
  moduleStatus: boolean;

  @ApiProperty({
    description: "User who created the permission",
    required: true,
    example: "vrameshbapu.nrl.com.au",
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({
    description: "User who updated the permission",
    required: true,
    example: "vrameshbapu.nrl.com.au",
  })
  @IsOptional()
  @IsString()
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
  updateAt?: Date;
}  

export class MetaDto {
    @ApiProperty({
      description: "number of row count",
      required: true,
      example: "10",
    })
    totalRowCount: number;
  }

export class GetAllPerissionsResponseDto {
    @ApiProperty({
      description: "list of Permissions",
      required: true,
      type: [PermissionResponseDto],
    })
    data: PermissionResponseDto[];
  
    @ApiProperty({
      description: "Meta information",
      required: true,
      type: MetaDto,
    })
    meta: MetaDto;
  }  

  class GetAllPermissionDto {
    @ApiProperty({
      description: "Id of the permission",
      example: " 6764830f06b3bf201a390f86",
    })
    @IsString()
    _id: Types.ObjectId;
  
    @ApiProperty({
      description: "Code of the permission",
      example: " view-contract-request",
    })
    @IsString()
    permissionCode: string;
  
    @ApiProperty({
      description: "Name of the permission",
      example: " view-contract-request",
    })
    @IsString()
    permissionName: string;
  }

  export class GetAllPermissionResponseDto {
    @ApiProperty({
      description: "Message describing the result of the operation",
      example: " All Permission data found successfully",
    })
    message: string;
  
    @ApiProperty({
      description: "The data returned by the operation",
      type: [GetAllPermissionDto],
    })
    data: GetAllPermissionDto[];
  }
  
  export class GetPerissionsDetailsResponseDto {
    @ApiProperty({
      description: "Detail of Permissions",
      required: true,
      type: PermissionResponseDto,
    })
    data: PermissionResponseDto;
  }
  
  export class CreateUpdatePermissionResponseDto {
    @ApiProperty({
      description: "Permission data created successfully",
      example: "The Permission has been successfully created/updated/deleted.",
    })
    message: string;
  }