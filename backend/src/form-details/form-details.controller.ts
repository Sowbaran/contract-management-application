import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import {
  ContractFormListResponseDto,
  ContractGetFormDetailsQueryParamsDto,
  ContractGetFormListParamsDto,
  ContractRequestQueryDto,
  CreateFormDto,
  CreateHeadCountResponseDto,
  CreateUpdateFormResponseDto,
  FileterMetaRequestDto,
  FilterMetaResponseDto,
  FormHistroyResponseDto,
  GetFormDetailResponseDto,
  UpdateFormDetailsDto,
  CreateHeadcountFormDto,
  HeadcountRequestQueryDto,
  HeadcountGetFormListParamsDto,
  HeadcountGetFormDetailsQueryParamsDto,
  HeadcountFormListResponseDto,
  GetHeadcountFormDetailResponseDto,
  UpdateHeadCountResponseDto,
  CreateDraftFormDto,
  CreateDraftFormResponseDto,
  GetResetQueryParamsDto,
  GetResetIdDto,
  ResetResponseDto,
  GetDeleteQueryParamsDto,
  DeleteResponseDto,
  GetRecallQueryParamsDto,
  GetGmUserQueryParamsDto,
  GMErrorResponseDto,
  GMDetailsResponseDto,
  RecallResponseDto,
  AuthenticatedRequest,
} from "@src/form-details/dto";
import { FormDetailsService } from "./form-details.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ErrorTypes } from "@src/utils/enums/error-types.enum";
import { Response } from "express";
import { isObject } from "class-validator";

@Controller("forms")
@ApiTags("Form Details")
@ApiResponse({ status: 403, description: ErrorTypes.FORBIDDEN })
@ApiResponse({ status: 400, description: ErrorTypes.BAD_REQUEST })
@ApiResponse({ status: 500, description: ErrorTypes.INTERNAL_SERVER_ERROR })
export class FormDetailsController {
  constructor(private readonly formDetailsService: FormDetailsService) {}
  protected readonly logger = new Logger(FormDetailsController.name);

  @Post("contract/create")
  @ApiResponse({
    status: 200,
    description: "Form has been submitted successfully!",
    type: CreateUpdateFormResponseDto,
  })
  @ApiOperation({
    operationId: "createContractForm",
    summary: "Create Contract Form",
  })
  async createContract(
    @Body() createFormDto: CreateFormDto,
    @Req() request: AuthenticatedRequest,
  ) {
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      createFormDto.createdBy = request.user.preferred_username;
    }
    return await this.formDetailsService.createContract(createFormDto);
  }

  @Post("draft/contract/create")
  @ApiResponse({
    status: 200,
    description: "Draft Form has been created successfully!",
    type: CreateDraftFormResponseDto,
  })
  @ApiOperation({
    operationId: "createDraftContractForm",
    summary: "Create Draft Contract Form",
  })
  async createDraftContract(
    @Body() CreateDraftFormDto: CreateDraftFormDto,
    @Req() request: AuthenticatedRequest,
  ) {
    if (
      process.env.ENVIRONMENT !== "local" &&
      process.env.ENVIRONMENT !== "dev"
    ) {
      CreateDraftFormDto.createdBy = request.user.preferred_username;
    }
    return await this.formDetailsService.createDraftContract(
      CreateDraftFormDto,
    );
  }

  @Get("/contract/list/:email")
  @ApiResponse({
    status: 200,
    description: "The list of form details has been successfully retrived.",
    type: ContractFormListResponseDto,
  })
  @ApiOperation({
    operationId: "getFormList",
    summary: "Get Contract Form List",
  })
  async getContractFormList(
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: ContractRequestQueryDto,
    @Param() emailId: ContractGetFormListParamsDto,
  ) {
    let email: string;
    if (
      process.env.ENVIRONMENT === "local" ||
      process.env.ENVIRONMENT === "dev"
    ) {
      email = emailId.email;
    } else {
      email = request.user.preferred_username;
    }
    const type = queryParams.type;
    const moduleId = queryParams.moduleId;
    return await this.formDetailsService.getContractFormList(
      email,
      type,
      moduleId,
    );
  }

  @Get("/contract/detail/:id")
  @ApiResponse({
    status: 200,
    description: "The form details has been successfully retrived.",
    type: GetFormDetailResponseDto,
  })
  @ApiOperation({
    operationId: "getFormDetail",
    summary: "Get Form Detail",
  })
  async getContractFormDetail(
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: ContractRequestQueryDto,
    @Param() id: ContractGetFormDetailsQueryParamsDto,
    @Query() emailId: ContractGetFormListParamsDto,
  ) {
    let email: string;
    if (
      process.env.ENVIRONMENT === "local" ||
      process.env.ENVIRONMENT === "dev"
    ) {
      email = emailId.email;
    } else {
      email = request.user.preferred_username;
    }
    const type = queryParams.type;
    const moduleId = queryParams.moduleId;
    const resDate = await this.formDetailsService.getContractFormDetail(
      id.id,
      email,
      type,
      moduleId,
    );
    return { data: resDate };
  }

  @Put("/contract/resubmit")
  @ApiResponse({
    status: 200,
    description: "Form has been resubmitted successfully!",
    type: CreateUpdateFormResponseDto,
  })
  @ApiOperation({
    operationId: "updateContractForm",
    summary: "Update Contract Form",
  })
  async updateContractForm(
    @Req() request: AuthenticatedRequest,
    @Body() updateFormDetailstDto: UpdateFormDetailsDto,
  ) {
    updateFormDetailstDto.updatedBy = request.user.preferred_username;
    let emailId = request.user.preferred_username;
    if (
      process.env.ENVIRONMENT === "local" ||
      process.env.ENVIRONMENT === "dev"
    ) {
      emailId = updateFormDetailstDto.createdBy;
    }
    return await this.formDetailsService.updateContractForm(
      updateFormDetailstDto,
      emailId,
    );
  }

  @Get("/contract/history/:id")
  @ApiResponse({
    status: 200,
    description: "The form history details has been successfully retrived.",
    type: FormHistroyResponseDto,
  })
  @ApiOperation({
    operationId: "getFormHistory",
    summary: "Get Form History",
  })
  async getFormHistory(@Param() id: ContractGetFormDetailsQueryParamsDto) {
    return await this.formDetailsService.getFormHistory(id.id);
  }

  @Get("filter/meta")
  @ApiResponse({
    status: 200,
    description: "Filtermeta has been successfully retrived.",
    type: FilterMetaResponseDto,
  })
  @ApiOperation({
    operationId: "getFilterMeta",
    summary: "Get Filter Meta",
  })
  async filterMeta(
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: FileterMetaRequestDto,
  ): Promise<FilterMetaResponseDto> {
    let emailId: string;
    if (
      process.env.ENVIRONMENT === "local" ||
      process.env.ENVIRONMENT === "dev"
    ) {
      emailId = queryParams.emailId;
    } else {
      emailId = request.user.preferred_username;
    }
    const moduleId = queryParams.moduleId;
    const type = queryParams.type;
    return await this.formDetailsService.filterMeta(emailId, moduleId, type);
  }

  @Post("/contract/reset/:id")
  @ApiResponse({
    status: 200,
    description: "Reset the form esign intiated to pending",
    type: ResetResponseDto,
  })
  @ApiOperation({
    operationId: "resetFormStatus",
    summary: "Reset the form in last level approver",
  })
  async formReset(
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: GetResetQueryParamsDto,
    @Param() id: GetResetIdDto,
  ) {
    let emailId = request.user.preferred_username;
    if (
      process.env.ENVIRONMENT === "local" ||
      process.env.ENVIRONMENT === "dev"
    ) {
      emailId = queryParams.emailId;
    }
    this.logger.log(`Form Reset controller- ${emailId}`);
    const moduleId = queryParams.moduleId;
    const type = queryParams.type;
    return await this.formDetailsService.formReset(
      id.id,
      emailId,
      moduleId,
      type,
    );
  }

  @Delete("/contract/:id")
  @ApiResponse({
    status: 200,
    description: "The Form has been successfully deleted",
    type: DeleteResponseDto,
  })
  @ApiOperation({
    operationId: "deleteFormById",
    summary: "Delete Form By Id",
  })
  async deleteForm(
    @Param() id: GetResetIdDto,
    @Query() queryParams: GetDeleteQueryParamsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    this.logger.log(`Form Deletet controller by formId-- ${id.id}`);
    const moduleId = queryParams.moduleId;
    const comments = queryParams.comments;
    return await this.formDetailsService.deleteForm(
      id.id,
      request.user.preferred_username,
      moduleId,
      comments,
    );
  }

  @Post("/contract/recall/:id")
  @ApiResponse({
    status: 200,
    description: "The Form has been successfully Recalled",
    type: RecallResponseDto,
  })
  @ApiOperation({
    operationId: "recallFormById",
    summary: "Recall Form By Id",
  })
  async recallForm(
    @Param() id: GetResetIdDto,
    @Query() queryParams: GetRecallQueryParamsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    let emailId = request.user.preferred_username;
    if (
      process.env.ENVIRONMENT === "local" ||
      process.env.ENVIRONMENT === "dev"
    ) {
      emailId = queryParams.emailId;
    }
    this.logger.log(`Form Recall controller by FormId- ${id.id}`);
    const moduleId = queryParams.moduleId;
    const comments = queryParams.comments;
    return await this.formDetailsService.recallForm(
      id.id,
      emailId,
      moduleId,
      comments,
    );
  }

  @Get("gmUser/check")
  @ApiResponse({
    status: 200,
    description: "Gm users retirved successfully ",
    type: GMDetailsResponseDto,
  })
  @ApiOperation({
    operationId: "getGMUser",
    summary: "Get GM User",
  })
  async getGMUser(
    @Req() request: AuthenticatedRequest,
    @Query() queryParams: GetGmUserQueryParamsDto,
  ): Promise<GMDetailsResponseDto> {
    let emailId: string;
    if (
      process.env.ENVIRONMENT === "local" ||
      process.env.ENVIRONMENT === "dev"
    ) {
      emailId = queryParams.email;
    } else {
      emailId = request.user.preferred_username;
    }
    this.logger.log(`Form GM check controller by emailId- ${emailId}`);
    const moduleId = queryParams.moduleId;
    const deptId = queryParams.deptId;
    return await this.formDetailsService.getGMdetails(
      emailId,
      moduleId,
      deptId,
    );
  }

  @Get("/monetary-value")
  @ApiResponse({
    status: 200,
    description: "Data fix completed successfully.",
  })
  @ApiOperation({
    operationId: "fixMonetaryValue",
    summary: "Fix Monetary Value",
  })
  async fixMonetaryValue() {
    await this.formDetailsService.updateMonetaryValueField();
    return { message: "Data fix completed successfully." };
  }

  // @Post("/headcount/create")
  // @ApiResponse({
  //   status: 200,
  //   description: "New Form has been created successfully",
  //   type: CreateHeadCountResponseDto,
  // })
  // @ApiOperation({
  //   operationId: "createHeadcount",
  //   summary: "Create Head Count",
  // })
  // async createHeadcount(
  //   @Body() createHeadcountFormDto: CreateHeadcountFormDto,
  //   @Req() request: AuthenticatedRequest,
  // ) {
  //   if (
  //     process.env.ENVIRONMENT !== "local" &&
  //     process.env.ENVIRONMENT !== "dev"
  //   ) {
  //     createHeadcountFormDto.createdBy = request.user.preferred_username;
  //   }
  //   return await this.formDetailsService.createHeadcount(
  //     createHeadcountFormDto,
  //   );
  // }

  // @Get("/headcount/list/:email")
  // @ApiResponse({
  //   status: 200,
  //   description: "The list of form details has been successfully retrived.",
  //   type: HeadcountFormListResponseDto,
  // })
  // @ApiOperation({
  //   operationId: "getHeadcountFormList",
  //   summary: "Get Headcount Form List",
  // })
  // async getHeadcountFormList(
  //   @Req() request: AuthenticatedRequest,
  //   @Query() queryParams: HeadcountRequestQueryDto,
  //   @Param() emailId: HeadcountGetFormListParamsDto,
  // ) {
  //   let email: string;
  //   if (
  //     process.env.ENVIRONMENT === "local" ||
  //     process.env.ENVIRONMENT === "dev"
  //   ) {
  //     email = emailId.email;
  //   } else {
  //     email = request.user.preferred_username;
  //   }
  //   const type = queryParams.type;
  //   const moduleId = queryParams.moduleId;
  //   return await this.formDetailsService.getHeadcountFormList(
  //     email,
  //     type,
  //     moduleId,
  //   );
  // }

  // @Get("/headcount/detail/:id")
  // @ApiResponse({
  //   status: 200,
  //   description: "The form details has been successfully retrived.",
  //   type: GetHeadcountFormDetailResponseDto,
  // })
  // @ApiOperation({
  //   operationId: "getHeadcountFormDetail",
  //   summary: "Get Headcount Form Detail",
  // })
  // async getHeadcountFormDetail(
  //   @Req() request: AuthenticatedRequest,
  //   @Query() queryParams: HeadcountRequestQueryDto,
  //   @Param() id: HeadcountGetFormDetailsQueryParamsDto,
  //   @Query() emailId: HeadcountGetFormListParamsDto,
  // ) {
  //   let email: string;
  //   if (
  //     process.env.ENVIRONMENT === "local" ||
  //     process.env.ENVIRONMENT === "dev"
  //   ) {
  //     email = emailId.email;
  //   } else {
  //     email = request.user.preferred_username;
  //   }
  //   const type = queryParams.type;
  //   const moduleId = queryParams.moduleId;
  //   const resDate = await this.formDetailsService.getHeadcountFormDetail(
  //     id.id,
  //     email,
  //     type,
  //     moduleId,
  //   );
  //   return { data: resDate };
  // }
  // @Post("/headcount/resubmit")
  // @ApiResponse({
  //   status: 200,
  //   description: "Form has been resubmitted successfully!",
  //   type: UpdateHeadCountResponseDto,
  // })
  // @ApiOperation({
  //   operationId: "updateHeadCount",
  //   summary: "Update Head Count",
  // })
  // async updateHeadCountForm(
  //   @Req() request: AuthenticatedRequest,
  //   @Body() updateFormDetailstDto: UpdateFormDetailsDto,
  // ) {
  //   let emailId = request.user.preferred_username;
  //   if (
  //     process.env.ENVIRONMENT === "local" ||
  //     process.env.ENVIRONMENT === "dev"
  //   ) {
  //     emailId = updateFormDetailstDto.createdBy;
  //   }
  //   return await this.formDetailsService.updateHeadCountForm(
  //     updateFormDetailstDto,
  //     emailId,
  //   );
  // }

  @ApiResponse({
    status: 200,
    description: "Csv file has been downloaded successfully!",
  })
  @ApiOperation({
    operationId: "exportCsvFormDetails",
    summary: "export Csv FormDetails",
  })
  @Get("export/csv")
  async exportCsvFormDetails(@Res() res: Response) {
    return this.formDetailsService.exportFormsToCSV(res);
  }
}
