import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { FormApprovalService } from "./form-approval.service";
import {
  AuthenticatedRequest,
  CallbackMessageDto,
  EnvelopeDetailsDto,
  FormApprovalMessageDto,
  FormMessageDto,
  GetEsignUrlQueryParamsDto,
  GetRetriggerIdDto,
  GetRetriggerQueryParamsDto,
  RetriggerResponseDto,
  UpdateFormApprovalDto,
} from "@src/form-approval/dto";
import { BypassAuth } from "@src/decorators";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ErrorTypes } from "@src/utils/enums/error-types.enum";

@Controller("form-approval")
@ApiTags("Form Approval")
@ApiResponse({ status: 403, description: ErrorTypes.FORBIDDEN })
@ApiResponse({ status: 400, description: ErrorTypes.BAD_REQUEST })
@ApiResponse({ status: 500, description: ErrorTypes.INTERNAL_SERVER_ERROR })
export class FormApprovalController {
  protected readonly logger = new Logger(FormApprovalController.name);

  constructor(private readonly formApprovalService: FormApprovalService) {}

  @Post("contract")
  @ApiResponse({
    status: 200,
    description: "The Contract form has been successfully approved.",
    type: FormApprovalMessageDto,
  })
  @ApiOperation({
    operationId: "createAprrovalForm",
    summary: "Contract Approval Form",
  })
  async contractFormApproval(
    @Req() request: AuthenticatedRequest,
    @Body() updateFormApprovalDto: UpdateFormApprovalDto,
  ) {
    let emailId = request.user.preferred_username;
    if (
      process.env.ENVIRONMENT === "local" ||
      process.env.ENVIRONMENT === "dev"
    ) {
      emailId = updateFormApprovalDto.emailId;
    }
    this.logger.log(`Form Approval Controller approved By- ${emailId}`);
    return await this.formApprovalService.contractFormApproval(
      updateFormApprovalDto,
      emailId,
    );
  }

  @Post("callback")
  @BypassAuth()
  @ApiResponse({
    status: 200,
    description: "The handleCallback has been hit successfully",
    type: CallbackMessageDto,
  })
  @ApiOperation({
    operationId: "handleCallBack",
    summary: "Handle Call Back",
  })
  async handleCallback(
    @Body() body: EnvelopeDetailsDto,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    @Headers() headers: any,
  ): Promise<CallbackMessageDto> {
    const signature = headers["x-signature"];
    this.logger.log(
      `Hit signature callback controller x-signature, ${signature}`,
    );
    this.logger.log(`${body}`);
    if (!signature) {
      this.logger.error("Forbidden - Missing signature");
      throw new HttpException(
        "Forbidden - Missing signature",
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.formApprovalService.formCompletionFlow(body, signature);
  }

  @Post("/docusignRetrigger/:id")
  @ApiResponse({
    status: 200,
    description: "Esign retriggerd ",
    type: RetriggerResponseDto,
  })
  @ApiOperation({
    operationId: "docusignRetrigger",
    summary: "Docusign Retrigger",
  })
  async docusignRetrigger(
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: GetRetriggerQueryParamsDto,
    @Param() id: GetRetriggerIdDto,
  ) {
    const formId = id.id;
    let emailId = request.user.preferred_username;
    if (
      process.env.ENVIRONMENT === "local" ||
      process.env.ENVIRONMENT === "dev"
    ) {
      emailId = queryParams.emailId;
    }
    this.logger.log(`Docusign Retrigger controller- ${emailId}`);
    const moduleId = queryParams.moduleId;
    const type = queryParams.type;
    return await this.formApprovalService.docusignRetrigger(
      formId,
      emailId,
      moduleId,
      type,
    );
  }

  @Post("headcount")
  @ApiResponse({
    status: 200,
    description: "The headcount form has been approved successfully",
    type: FormMessageDto,
  })
  @ApiOperation({
    operationId: "headcountFormApproval",
    summary: "Head Count Form Approval",
  })
  async headcountFormApproval(
    @Req() request: AuthenticatedRequest,
    @Body() updateFormApprovalDto: UpdateFormApprovalDto,
  ) {
    let emailId = request.user.preferred_username;
    if (
      process.env.ENVIRONMENT === "local" ||
      process.env.ENVIRONMENT === "dev"
    ) {
      emailId = updateFormApprovalDto.emailId;
    }
    this.logger.log(
      `Headcount Form Approval Controller approved By- ${emailId}`,
    );
    return await this.formApprovalService.headCountFormApproval(
      updateFormApprovalDto,
      emailId,
    );
  }
}
