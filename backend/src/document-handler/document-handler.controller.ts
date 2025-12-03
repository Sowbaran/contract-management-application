import { Controller, Post, Body, Get, Query, Logger } from "@nestjs/common";
import { DocumentHandlerService } from "./document-handler.service";
import { ErrorTypes } from "@src/utils/enums/error-types.enum";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  GenerateDownloadDto,
  GenerateDownloadResponseDto,
  GeneratePreSignedUrlResponseDto,
  GenerateSignedUrlQueryparamsDto,
  PreSignedUrlDto,
  UpdateFormRequestDto,
  UploadResponseDto,
  UrlDto,
} from "@src/document-handler/dto";

@Controller("document-handler")
@ApiTags("Document Handler")
@ApiResponse({ status: 403, description: ErrorTypes.FORBIDDEN })
@ApiResponse({ status: 400, description: ErrorTypes.BAD_REQUEST })
@ApiResponse({ status: 500, description: ErrorTypes.INTERNAL_SERVER_ERROR })
export class DocumentHandlerController {
  private logger: Logger;
  constructor(private readonly documentHandlerService: DocumentHandlerService) {
    this.logger = new Logger(DocumentHandlerController.name);
  }

  @Get("/generate-signedurl")
  @ApiResponse({
    status: 200,
    description: "The signed url has been generated successfully",
    type: UrlDto,
  })
  @ApiOperation({
    operationId: "generateSignedUrl",
    summary: "Generate Signed Url",
  })
  async generateSignedUrl(@Query() params: GenerateSignedUrlQueryparamsDto) {
    this.logger.log("Generating signed url");
    return await this.documentHandlerService.generateSignedUrl(
      params.key,
      params.contentType,
    );
  }

  @Post("/updateFormStatus")
  @ApiResponse({
    status: 200,
    description: "Document successfully uploaded",
    type: UploadResponseDto,
  })
  @ApiOperation({
    operationId: "updateFormStaus",
    summary: "Update Form Status",
  })
  async updateFormStaus(@Body() body: UpdateFormRequestDto) {
    this.logger.log("Updating form status");
    return await this.documentHandlerService.updateFormStatus(
      body.formId,
      body.s3Location,
    );
  }

  @Get("/files-download")
  @ApiResponse({
    status: 200,
    description: "Files downloaded successfully",
    type:GenerateDownloadResponseDto
  })
  @ApiOperation({
    operationId: "generateDownload",
    summary: "Generate Download",
  })
  async generateDownload(@Query() params: GenerateDownloadDto) {
    this.logger.log("Generating download");
    return await this.documentHandlerService.generateDownload(params.url);
  }

  @Get("/files-fetch")
  @ApiResponse({
    status: 200,
    description: "Pre Signed Url generated successfully",
    type:GeneratePreSignedUrlResponseDto
  })
  @ApiOperation({
    operationId: "generatePreSignedUrl",
    summary: "Generate Pre Signed Url",
  })
  async generatePreSignedUrl(@Query() params: PreSignedUrlDto) {
    this.logger.log("Generating presigned url");
    return await this.documentHandlerService.generatePreSignedUrl(params.url);
  }
}
