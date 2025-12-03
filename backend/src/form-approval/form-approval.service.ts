import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { SecretService } from "../secret/secret.service";
import {
  FormDetailsRepository,
  RolesRepository,
  UsersRepository,
  WorkflowRepository,
  FormModuleRepository,
} from "@app/common";
import { MailerCommonService, trimStringToLength } from "@src/utils";
import {
  CallbackMessageDto,
  EnvelopeDetailsDto,
  FormApprovalMessageDto,
  FormMessageDto,
  RetriggerResponseDto,
  UpdateFormApprovalDto,
} from "@src/form-approval/dto";
import {
  BucketFolerNames,
  commonDomainEndPaths,
  DocusignStatus,
  EmailStatus,
  FormApprovlValidation,
  FormHistoryStatus,
  FormStatus,
  MailRedirectFrontEndPathMyRequest,
  ModuleCode,
  PermissionCodes,
  ROLECODES,
  TabRequest,
} from "../constants";
import { validateSignatureHmac } from "@src/utils";
import { ConfigService } from "@nestjs/config";
import { HelperService } from "../helper/helper.service";
import { Types, UpdateQuery } from "mongoose";
import { FormDetails } from "@src/form-details/formDetails.model";

@Injectable()
export class FormApprovalService implements OnModuleInit {
  private bucketName: string;
  protected readonly logger = new Logger(FormApprovalService.name);
  private signatureServiceAppName: string;
  private signatureServiceBasePath: string;
  private signatureServiceApiKey: string;
  private signatureServiceApiVersion: string;
  private formSignatureCallbackPath: string;
  private signatureHmacKey: string;
  private formSignatureSigningUrlRetunPath: string;

  constructor(
    private secretService: SecretService,
    private rolesRepo: RolesRepository,
    private usersRepo: UsersRepository,
    private formDetailsRepo: FormDetailsRepository,
    private workflowRepo: WorkflowRepository,
    private formModuleRepository: FormModuleRepository,
    private readonly mailerCommonService: MailerCommonService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private helperService: HelperService,
  ) {
    this.bucketName = this.configService.get<string>("AWS_S3_BUCKET") || "";
  }

  async onModuleInit() {
    const secrets = await this.secretService.fetchSecret();
    this.signatureServiceAppName = secrets.signatureServiceAppName;
    this.signatureServiceBasePath = secrets.signatureServiceBasePath;
    this.signatureServiceApiKey = secrets.signatureServiceApiKey;
    this.signatureServiceApiVersion = secrets.signatureServiceApiVersion;
    this.formSignatureCallbackPath = secrets.formSignatureCallbackPath;
    this.signatureHmacKey = secrets.signatureServiceHMACKey;
    this.formSignatureSigningUrlRetunPath =
      secrets.formSignatureSigningUrlRetunPath;
  }

  async contractFormApproval(
    updateFormApprovalDto: UpdateFormApprovalDto,
    userEmailId: string,
  ): Promise<FormApprovalMessageDto> {
    const id = updateFormApprovalDto.formId;
    const emailId = userEmailId;
    const status = updateFormApprovalDto.status;
    const comments = updateFormApprovalDto.comments;
    const isAdditionalAccess = updateFormApprovalDto.isAdditionalAccess;
    const formAdditionalInfo = updateFormApprovalDto.formAdditionalInfo;
    const mailRedirectPath = updateFormApprovalDto.mailRedirectPath;
    const moduleId = updateFormApprovalDto.moduleId;
    this.logger.log(
      `Contract Form Approval isAdditionalAccess:${isAdditionalAccess}`,
    );
    this.logger.log(`formAdditionalInfo:${JSON.stringify(formAdditionalInfo)}`);
    if (!Object.values(FormApprovlValidation).includes(status)) {
      throw new BadRequestException("Invalid Status");
    }
    const options = { select: "code -_id" };
    const formModuleCode = await this.formModuleRepository.findById(
      moduleId,
      options,
    );
    if (!formModuleCode) {
      throw new NotFoundException(`Module #${moduleId} not found`);
    }
    const { code: moduleCode } = formModuleCode;
    if (moduleCode !== ModuleCode.VENDORCONTRACT) {
      throw new NotFoundException(`Invalid Module`);
    }
    const moduleType = moduleCode.toUpperCase() as keyof typeof PermissionCodes;
    const userDetails = await this.usersRepo.findOneExisting({
      email: emailId,
      status: true,
    });
    const departments = userDetails?.departments || [];
    this.logger.log(
      `form approve userDetails departments- ${userDetails ? JSON.stringify(userDetails.departments) : ""}`,
    );
    const permissionCode = this.helperService.getPermissionCode(
      TabRequest.APPROVEREQUEST,
      moduleType,
    );
    this.logger.log(
      `Module Code: ${formModuleCode.code}, Permission Code: ${permissionCode}`,
    );

    const { queryCriteria } = await this.helperService.validateUserPermissions(
      emailId,
      TabRequest.APPROVEREQUEST,
      departments,
      moduleCode,
      permissionCode,
      moduleId,
      id.toString(),
    );
    this.logger.log(
      `Contract Form Approval queryCriteria ${JSON.stringify(queryCriteria)}`,
    );
    const formDetailsModels =
      await this.formDetailsRepo.findOneExisting(queryCriteria);

    if (formDetailsModels) {
      const workflowId = formDetailsModels.workflow; //Role ID for that approval level
      const code = formDetailsModels.code;
      const department = formDetailsModels.department;
      const userEmails = formDetailsModels.createdBy;
      let createdBy = userEmails;
      //const counterParty = (formDetailsModels.formInfo as any).counter_party;
      const counterParty = (
        formDetailsModels.formInfo as { counter_party: string }
      ).counter_party;
      const msaAttachmentRequired =
        (formDetailsModels.formInfo as { approval_being_sought: string })
          .approval_being_sought !== "Expenditure no contract for signing";
      const approvalBeingSought = (
        formDetailsModels.formInfo as { approval_being_sought: string }
      ).approval_being_sought;
      const departmentName = formDetailsModels.departmentName;
      const workflowName = formDetailsModels.workflowName;
      const moduleCode = formDetailsModels.moduleCode;
      const workflowOrder = formDetailsModels.workflowOrder;
      const url = formDetailsModels.msaAttachments
        ? formDetailsModels.msaAttachments[0]
        : "";
      const deptDetails = {
        departmentName: departmentName,
        department: department,
      };
      if (moduleCode !== ModuleCode.VENDORCONTRACT) {
        throw new NotFoundException(`Invalid Module`);
      }
      if (!url && msaAttachmentRequired) {
        throw new NotFoundException(`Msa Attachments Not Found`);
      }

      const approvarName = userDetails ? userDetails.name : "";
      const approvarEmail = userDetails ? userDetails.email : "";
      let nextWorkflowName: string;
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const queryCriteria: any = {};
      const currentWorkflow = workflowOrder.find(
        (item) => item.roleId.toString() === workflowId.toString(),
      );
      this.logger.log(
        `Contract Form current Workflow ${JSON.stringify(currentWorkflow)}`,
      );
      if (!currentWorkflow) {
        throw new NotFoundException(`No Workflow Found.`);
      }
      let formMessage = "Form approved successfully!";
      let signingUrl = "";
      this.logger.log(
        `Contract Form Approval service name status is- ${approvarName} - ${status}`,
      );

      if (status !== FormStatus.REJECTED) {
        const nextWorkflow = workflowOrder.find(
          (item) => item.level === currentWorkflow.level + 1,
        );
        this.logger.log(
          `Contract Form Next Workflow ${JSON.stringify(nextWorkflow)}`,
        );
        if (nextWorkflow) {
          nextWorkflow.status = FormStatus.PENDING;
          nextWorkflowName = nextWorkflow.name ? nextWorkflow.name : "";
          const roleDetails = {
            roleId: nextWorkflow.roleId,
            roleName: nextWorkflow.name,
            isSpecificDeptApprover: nextWorkflow.isSpecificDeptApprover,
          };
          const userEmails = await this.helperService.getNextApprovers(
            deptDetails,
            roleDetails,
            moduleId,
            code,
            "contractFormApproval",
          );

          if (userEmails.includes(createdBy)) {
            createdBy = ""; // Set created_by to an empty string if it matches any email in the userEmails array
          }
          queryCriteria.workflow = nextWorkflow.roleId;
          queryCriteria.workflowName = nextWorkflowName;
          const updateQuery = { _id: id };
          const update = {
            $set: {
              "workflowOrder.$[currentLevel].status":
                FormHistoryStatus.COMPLETED,
              "workflowOrder.$[nextLevel].status": FormHistoryStatus.PENDING,
              ...queryCriteria,
            },
            $push: {
              formHistory: {
                approvedBy: emailId,
                status: status,
                workflow: workflowId,
                workflowName: workflowName,
                department: department,
                departmentName: departmentName,
                createdAt: Date.now(),
                comments: comments,
              },
            },
          };
          const arrayFilters = [
            { "currentLevel.level": currentWorkflow.level },
            { "nextLevel.level": nextWorkflow.level },
          ];
          const options = {
            arrayFilters: arrayFilters,
          };
          await this.formDetailsRepo.findOneAndUpdate(
            updateQuery,
            update,
            options,
          );
          this.logger.log(
            `Contract Form Approval updated in Db, email service will be initiated`,
          );

          await this.mailerCommonService.sendAssociateEmail(
            mailRedirectPath,
            userEmails,
            code,
            EmailStatus.PENDINGAPPROVAL,
            counterParty,
            "",
            createdBy,
          );
        } else {
          if (updateFormApprovalDto.eSignRequired) {
            this.logger.log(`Contract Form Approval esign required`);

            this.logger.log(`Contract form final approver flow-code- ${code}`);
            console.log("Inside esign required");
            let historyStatus = FormHistoryStatus.COMPLETED;
            const workflowOrderStatus = FormHistoryStatus.PENDING;
            formMessage =
              "E-sign Initiated Successfully! You will soon receive an email from DocuSign to sign the agreement. Please check your inbox!";
            if (!approvarName || !approvarEmail) {
              throw new NotFoundException(`Invalid Name or Email`);
            }
            const userDetailsList = [
              { name: approvarName, email: approvarEmail },
            ];
            if (updateFormApprovalDto.witnessFlag) {
              userDetailsList.push({
                name: updateFormApprovalDto.witnessName ?? "",
                email: updateFormApprovalDto.witnessEmail ?? "",
              });
            }
            this.logger.log(
              `approver userDetailsList ${JSON.stringify(userDetailsList)}`,
            );
            const subject = `Sign the contract - ${counterParty}`;
            const parts = url.split("/");
            const data = {
              unSignedDocBucketName: this.bucketName,
              unSignedDocKey: url,
              fileName: parts[1],
              subject: trimStringToLength(subject),
              signers: userDetailsList,
              appName: this.signatureServiceAppName,
              signedDocBucketName: this.bucketName,
              signedDocFolder: BucketFolerNames.APPROVERSIGNEDMSADOCUMENT,
              callBackUrl: `${this.formSignatureCallbackPath}${commonDomainEndPaths.SIGNATURECALLBACK}`,
              isWintess: updateFormApprovalDto.witnessFlag,
              wintessNumber: updateFormApprovalDto.witnessFlag ? 1 : 0,
            };
            this.logger.log(`signature_data ${JSON.stringify(data)}`);
            queryCriteria.envelopeSummary = data;
            try {
              this.logger.log("Enter into signature service--");
              const res = await firstValueFrom(
                this.httpService.post(
                  `${this.signatureServiceBasePath}${commonDomainEndPaths.SIGNATURESENDENVELOPE}`,
                  data,
                  {
                    headers: {
                      "x-api-key": this.signatureServiceApiKey,
                      "X-Api-Version": this.signatureServiceApiVersion,
                    },
                  },
                ),
              );
              this.logger.log(`Docusign response ${JSON.stringify(res.data)}`);
              queryCriteria.envelopeSummary = res.data;
              queryCriteria.docusignStatus = DocusignStatus.SENTFAILURE;
              historyStatus = DocusignStatus.ESIGNINFAILED;
              if (res.data.status === "sent" && res.data.envelopeId) {
                historyStatus = DocusignStatus.ESIGNINITIATED;
                signingUrl = res.data.signingUrl;
                queryCriteria.signers = userDetailsList;
                queryCriteria.envelopeId = res.data.envelopeId;
                queryCriteria.status = DocusignStatus.ESIGNINITIATED;
                queryCriteria.docusignStatus = DocusignStatus.SENTSUCCESS;
              }
            } catch (error) {
              const updateFields = {
                envelopeSummary: error,
                docusignStatus: DocusignStatus.SENTFAILURE,
              };
              await this.formDetailsRepo.findOneAndUpdate(
                { _id: id },
                {
                  $set: updateFields,
                },
              );
              this.logger.error(`Docusign error: ${error}`);
              this.logger.error(`Docusign error: ${JSON.stringify(error)}`);
              throw new InternalServerErrorException(error);
            }
            const updateQuery = {
              _id: id,
              "workflowOrder.level": currentWorkflow.level,
            };
            const update = {
              $set: {
                "workflowOrder.$.status": workflowOrderStatus,
                ...queryCriteria,
              },
              $push: {
                formHistory: {
                  $each: [
                    {
                      approvedBy: emailId,
                      status: historyStatus,
                      workflow: workflowId,
                      workflowName: workflowName,
                      department: department,
                      departmentName: departmentName,
                      createdAt: Date.now(),
                      comments: comments,
                    },
                    ...(updateFormApprovalDto.witnessFlag
                      ? [
                          {
                            approvedBy: updateFormApprovalDto.witnessEmail,
                            status: EmailStatus.WITNESS,
                            workflowName: EmailStatus.WITNESS,
                            department: "",
                            departmentName: "",
                            createdAt: Date.now(),
                            comments: comments,
                          },
                        ]
                      : []),
                  ],
                },
              },
            };
            await this.formDetailsRepo.findOneAndUpdate(updateQuery, update);
          } else {
            this.logger.log(`Contract Form Approval - esign not required`);
            const emailStatus =
              approvalBeingSought === "Expenditure no contract for signing"
                ? FormStatus.FULFILLED
                : FormStatus.COMPLETED;
            const updateQuery = { _id: id };
            const update = {
              $set: {
                "workflowOrder.$[currentLevel].status":
                  FormHistoryStatus.COMPLETED,
                status: emailStatus,
              },
              $push: {
                formHistory: {
                  $each: [
                    //approved by history
                    {
                      approvedBy: emailId,
                      status: status,
                      workflow: workflowId,
                      workflowName: workflowName,
                      department: department,
                      departmentName: departmentName,
                      createdAt: Date.now(),
                      comments: comments,
                    },
                    //completed history
                    {
                      approvedBy: emailId,
                      status: emailStatus, 
                      workflow: workflowId,
                      workflowName: workflowName,
                      department: department,
                      departmentName: departmentName,
                      createdAt: Date.now(),
                    },
                    ...(approvalBeingSought ===
                    "Expenditure no contract for signing"
                      ? [
                          {
                            approvedBy: "System",
                            status: FormStatus.FULFILLED,
                            createdAt: Date.now(),
                            comments:
                              "Automatically fulfilled: Expenditure no contract for signing",
                          },
                        ]
                      : []),
                  ],
                },
              },
            };
            const arrayFilters = [
              { "currentLevel.level": currentWorkflow.level },
            ];
            const options = {
              arrayFilters: arrayFilters,
            };
            await this.formDetailsRepo.findOneAndUpdate(
              updateQuery,
              update,
              options,
            );
            this.logger.log(
              `Contract Form Approval updated in Db, email service will be initiated`,
            );

            const mailRedirectPath = MailRedirectFrontEndPathMyRequest.replace(
              "formDetailId",
              id.toString(),
            );
            const queryString = mailRedirectPath.replace(
              "ModuleCodeId",
              moduleId.toString(),
            );
            await this.mailerCommonService.sendAssociateEmail(
              queryString,
              userEmails,
              code,
              emailStatus,
              counterParty,
            );
          }
        }
      } else {
        this.logger.log(`Form will be enter rejection flow`);
        formMessage = "Form has been rejected.";
        const updateQuery = {
          _id: id,
          "workflowOrder.level": currentWorkflow.level,
        };
        const update = {
          $set: {
            "workflowOrder.$.status": FormHistoryStatus.REJECTED,
            status: status,
          },
          $push: {
            formHistory: {
              approvedBy: emailId,
              status: status,
              workflow: workflowId,
              workflowName: workflowName,
              department: department,
              departmentName: departmentName,
              createdAt: Date.now(),
              comments: comments,
            },
          },
        };
        await this.formDetailsRepo.findOneAndUpdate(updateQuery, update);
        await this.mailerCommonService.sendAssociateEmail(
          mailRedirectPath,
          userEmails,
          code,
          EmailStatus.REJECTED,
          counterParty,
          comments,
        );
      }
      if (isAdditionalAccess) {
        const updateQuery = { _id: id };
        const update = {
          $set: { formAdditionalInfo: formAdditionalInfo },
        };
        await this.formDetailsRepo.findOneAndUpdate(updateQuery, update);
      }
      return { message: formMessage, signingUrl: signingUrl };
    }

    //if (!formDetailsModels) {
    throw new NotFoundException(
      `Form #${id} not found or You do not have the required permissions`,
    );
    //}
  }

  async formCompletionFlow(
    body: EnvelopeDetailsDto,
    signature: string,
  ): Promise<CallbackMessageDto> {
    const envelopStatus = body.envelopeStatus;
    if (
      envelopStatus === "envelope-completed" ||
      envelopStatus === "envelope-declined"
    ) {
      this.logger.log(
        `form builer formCompletionFlow Body, ${JSON.stringify(body)}`,
      );
      this.logger.log(
        `Hit signature formCompletionFlow service, ${this.signatureHmacKey}`,
      );
      if (!validateSignatureHmac(body, signature, this.signatureHmacKey)) {
        this.logger.error("Forbidden - Invalid HMAC signature");
        throw new HttpException(
          "Forbidden - Invalid HMAC signature",
          HttpStatus.FORBIDDEN,
        );
      }
      const envelopeId = body.envelopeId;
      const documentUrl = body.signedDocKey ? body.signedDocKey : "";
      const signers = body.signers;
      this.logger.log("envelopeId:", envelopeId);
      const declinedReason = body.declinedUser ? body.declinedUser.reason : "";
      const formDetailsModels = await this.formDetailsRepo.findOne({
        envelopeId,
        active: true,
      });
      const workflowId = formDetailsModels.workflow; //Role ID for that approval level
      const code = formDetailsModels.code;
      const formId = formDetailsModels._id;
      const moduleId = formDetailsModels.moduleId;
      const department = formDetailsModels.department;
      const userEmails = formDetailsModels.createdBy;
      //const counterParty = (formDetailsModels.formInfo as any).counter_party;
      const counterParty = (
        formDetailsModels.formInfo as { counter_party: string }
      ).counter_party;
      const departmentName = formDetailsModels.departmentName;
      const workflowName = formDetailsModels.workflowName;

      // Find the last level in the workflowOrder array
      const lastLevelIndex = formDetailsModels.workflowOrder.length - 1;
      const lastLevelPath = `workflowOrder.${lastLevelIndex}.status`;
      const emailStatus =
        envelopStatus === "envelope-completed"
          ? EmailStatus.COMPLETED
          : DocusignStatus.ESIGNDECLINED;
      const formStatus =
        envelopStatus === "envelope-completed"
          ? FormHistoryStatus.COMPLETED
          : FormHistoryStatus.PENDING;
      const signerEmail = signers.length > 0 ? signers[0].email : "";
      const witnessSignerEmail = signers?.[1]?.email || "";

      const mailRedirectPath = MailRedirectFrontEndPathMyRequest.replace(
        "formDetailId",
        formId.toString(),
      );
      const queryCriteria = {
        status: formStatus,
        docusignStatus: envelopStatus,
      };
      const updateQuery = { _id: formId };
      const update: UpdateQuery<FormDetails> = {
        $set: {
          ...queryCriteria,
          [lastLevelPath]: FormHistoryStatus.COMPLETED, // Update the status of the last level to 'completed'
        },
        $push: {
          formHistory: {
            $each: [
              {
                ...(signerEmail && { approvedBy: signerEmail }),
                status: emailStatus,
                workflow: workflowId,
                workflowName: workflowName,
                department: department,
                departmentName: departmentName,
                createdAt: Date.now(),
                comments: declinedReason ? declinedReason : "",
              },
              ...(witnessSignerEmail
                ? [
                    {
                      approvedBy: witnessSignerEmail,
                      status: emailStatus,
                      workflowName: EmailStatus.WITNESS,
                      department: "",
                      departmentName: "",
                      createdAt: Date.now(),
                      comments: declinedReason ? declinedReason : "",
                    },
                  ]
                : []),
            ],
          },
        },
      };
      // Conditionally push msaAttachments if documentUrl is provided
      if (documentUrl) {
        if (!update.$push) update.$push = {};
        update.$push.msaAttachments = documentUrl;
      }
      await this.formDetailsRepo.findOneAndUpdate(updateQuery, update);

      const queryString = mailRedirectPath.replace(
        "ModuleCodeId",
        moduleId.toString(),
      );
      await this.mailerCommonService.sendAssociateEmail(
        queryString,
        userEmails,
        code,
        emailStatus,
        counterParty,
        declinedReason ? declinedReason : "",
      );
    }
    return {
      message: `Callback event ${envelopStatus}  hit successfully`,
    };
  }

  async docusignRetrigger(
    formId: string,
    email: string,
    moduleId: string,
    type: string,
  ): Promise<RetriggerResponseDto> {
    this.logger.log(`Docusign Retrigger service started for formId: ${formId}`);

    if (
      !Object.values(TabRequest).includes(type) ||
      type !== TabRequest.ESIGNREQUEST
    ) {
      throw new BadRequestException("Invalid type: Must be ESIGNREQUEST");
    }

    // Validate module
    const formModuleCode = await this.formModuleRepository.findById(moduleId, {
      select: "code -_id",
    });
    if (!formModuleCode) {
      throw new NotFoundException(`Module #${moduleId} not found`);
    }
    const { code: moduleCode } = formModuleCode;
    if (moduleCode !== ModuleCode.VENDORCONTRACT) {
      throw new NotFoundException(`Invalid Module: Must be VENDORCONTRACT`);
    }

    // Fetch user details and validate permissions
    const userDetails = await this.usersRepo.findOneExisting({
      email,
      status: true,
    });
    const departments = userDetails?.departments || [];
    const moduleType = moduleCode.toUpperCase() as keyof typeof PermissionCodes;
    const permissionCode = this.helperService.getPermissionCode(
      TabRequest.ESIGNREQUEST,
      moduleType,
    );

    this.logger.log(
      `Module Code: ${moduleCode}, Permission Code: ${permissionCode}`,
    );

    const { queryCriteria } = await this.helperService.validateUserPermissions(
      email,
      TabRequest.ESIGNREQUEST,
      departments,
      moduleCode,
      permissionCode,
      moduleId,
      formId.toString(),
    );

    const formDetails =
      await this.formDetailsRepo.findOneExisting(queryCriteria);
    if (!formDetails) {
      throw new NotFoundException(
        `Form #${formId} not found or you do not have the required permissions`,
      );
    }

    // Validate envelopeId
    const { envelopeId, signers } = formDetails;
    if (!envelopeId) {
      throw new NotFoundException(`Invalid Envelope: envelopeId not found`);
    }

    // Prepare data for resend request
    const data = { envelopeId };
    const endpoint = `${this.signatureServiceBasePath}${commonDomainEndPaths.RESENDENVELOPE}`;
    this.logger.log(`Signature retrigger data: ${JSON.stringify(data)}`);
    this.logger.log(`Endpoint: ${endpoint}`);

    try {
      // Send resend request to DocuSign
      const res = await firstValueFrom(
        this.httpService.post(endpoint, data, {
          headers: {
            "x-api-key": this.signatureServiceApiKey,
            "X-Api-Version": this.signatureServiceApiVersion,
          },
        }),
      );

      this.logger.log(`DocuSign response: ${JSON.stringify(res.data)}`);
      this.logger.log("HTTP Status:", HttpStatus);
      // Check if the resend was successful
      if (res.data?.message === DocusignStatus.ENVELOPRESENDSUCCESS) {
        const updateQuery = { _id: formId };
        const update = {
          $set: { updatedBy: email },
          $push: {
            formHistory: {
              approvedBy: email,
              status: FormHistoryStatus.Retriggered,
              createdAt: new Date(),
            },
          },
        };

        const updatedForm = await this.formDetailsRepo.findOneAndUpdate(
          updateQuery,
          update,
        );
        if (!updatedForm) {
          throw new NotFoundException(
            `Form #${formId} not found during update`,
          );
        }

        return {
          message:
            "E-sign Resend Successful! You will soon receive an email from DocuSign to sign the agreement. Please check your inbox!",
        };
      } else {
        throw new InternalServerErrorException(
          res.data?.message ||
            "E-sign Resend failed: DocuSign response indicates failure",
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      this.logger.error(`Error during DocuSign retrigger: ${errorMessage}`);
      throw new InternalServerErrorException(
        errorMessage ||
          "E-sign Resend request could not be processed. Please try again later.",
      );
    }
  }

  async headCountFormApproval(
    updateFormApprovalDto: UpdateFormApprovalDto,
    userEmailId: string,
  ): Promise<FormMessageDto> {
    const id = updateFormApprovalDto.formId;
    const emailId = userEmailId;
    const status = updateFormApprovalDto.status;
    const comments = updateFormApprovalDto.comments;
    const headOfPnCFinalApproverFlag =
      updateFormApprovalDto.isHeadOfPnCFinalApprover;
    const mailRedirectPath = updateFormApprovalDto.mailRedirectPath;
    const moduleId = updateFormApprovalDto.moduleId;

    if (!Object.values(FormApprovlValidation).includes(status)) {
      throw new BadRequestException("Invalid Status");
    }

    const options = { select: "code -_id" };
    const formModuleCode = await this.formModuleRepository.findById(
      moduleId,
      options,
    );
    if (!formModuleCode) {
      throw new NotFoundException(`Module #${moduleId} not found`);
    }
    const { code: moduleCode } = formModuleCode;
    const moduleType = moduleCode.toUpperCase() as keyof typeof PermissionCodes;
    const userDetails = await this.usersRepo.findOneExisting({
      email: emailId,
      status: true,
    });
    const departments = userDetails?.departments || [];
    this.logger.log(
      `headCount Form approve userDetails departments- ${userDetails ? JSON.stringify(userDetails.departments) : ""}`,
    );
    const permissionCode = this.helperService.getPermissionCode(
      TabRequest.APPROVEREQUEST,
      moduleType,
    );
    this.logger.log(
      `Headcount Module Code: ${formModuleCode.code}, Permission Code: ${permissionCode}`,
    );

    const { queryCriteria, isAllAccess } =
      await this.helperService.validateUserPermissions(
        emailId,
        TabRequest.APPROVEREQUEST,
        departments,
        moduleCode,
        permissionCode,
        moduleId,
        id.toString(),
      );

    const formDetailsModels =
      await this.formDetailsRepo.findOneExisting(queryCriteria);

    if (formDetailsModels) {
      const workflowId = formDetailsModels.workflow;
      const code = formDetailsModels.code;
      const department = formDetailsModels.department;
      const userEmails = formDetailsModels.createdBy;
      let createdBy = userEmails;
      const departmentName = formDetailsModels.departmentName;
      const workflowName = formDetailsModels.workflowName;
      const workflowOrder = formDetailsModels.workflowOrder;
      // const roleReportingEmail = (formDetailsModels.formInfo as any)
      //   .role_reporting_email;
      const roleReportingEmail = (
        formDetailsModels.formInfo as { role_reporting_email: string }
      ).role_reporting_email;
      const options = { select: "code -_id" };
      const formModuleCode = await this.formModuleRepository.findById(
        moduleId,
        options,
      );

      if (!formModuleCode) {
        throw new NotFoundException(`Module #${moduleId} not found`);
      }
      const { code: moduleCode } = formModuleCode;
      if (moduleCode !== ModuleCode.HEADCOUNTREQUEST) {
        throw new NotFoundException(`Invalid Module`);
      }
      const deptDetails = {
        departmentName: departmentName,
        department: department,
      };
      //const roles = userDetails.roles;
      let behalfApprover = false;
      const framebehalfApproverText = `behalf of ${workflowName}`;
      let workflowHistoryName = workflowName;

      if (isAllAccess) {
        behalfApprover = true;
        if (userDetails) {
          const rolesWithAccess = userDetails.departments
            .flatMap((department) => department.roles)
            .filter(
              (role) =>
                role.code === ROLECODES.SUPERADMIN ||
                ROLECODES.HEADCOUNTMODULEADMIN,
            )
            .map((role) => role.name);

          workflowHistoryName = rolesWithAccess.join(", ");
        }
      }

      const approvarName = userDetails ? userDetails.name : "";
      let nextWorkflowName: string;
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const queryCriteria: any = {};
      //await this.workflowRepo.findById(workflowVersion);
      const currentWorkflow = workflowOrder.find(
        (item) => item.roleId.toString() === workflowId.toString(),
      );
      if (!currentWorkflow) {
        throw new NotFoundException(`No Workflow Found.`);
      }
      let formMessage = "Form approved successfully!";
      this.logger.log(
        `Headcount Form Approval service name status is- ${approvarName} - ${status}`,
      );
      if (status !== FormStatus.REJECTED) {
        this.logger.log(`Headcount form approver flow-code- ${code}`);
        let isHeadOfPnCFinalApprover = false;
        const nextWorkflow = workflowOrder.find(
          (item: { level: number }) => item.level === currentWorkflow.level + 1,
        );
        if (nextWorkflow) {
          this.logger.log(
            `Headcount Next Workflow ${JSON.stringify(nextWorkflow)}`,
          );
          nextWorkflow.status = FormStatus.PENDING;
          nextWorkflowName = nextWorkflow.name ? nextWorkflow.name : "";
          const roleDetails = {
            roleId: nextWorkflow.roleId,
            roleName: nextWorkflow.name,
            isSpecificDeptApprover: nextWorkflow.isSpecificDeptApprover,
          };
          const userEmails = await this.helperService.getNextApprovers(
            deptDetails,
            roleDetails,
            moduleId,
            code,
            "headCountFormApproval",
          );
          if (userEmails.includes(createdBy)) {
            createdBy = ""; // Set createdBy to an empty string if it matches any email in the userEmails array
          }

          isHeadOfPnCFinalApprover = nextWorkflow.isHeadOfPnCFinalApprover
            ? nextWorkflow.isHeadOfPnCFinalApprover
            : false; // this flag set true in last level of approver when the role is new or not in budget
          queryCriteria.workflow = nextWorkflow.roleId;
          queryCriteria.workflowName = nextWorkflowName;
          const updateQuery = { _id: id };
          const update = {
            $set: {
              "workflowOrder.$[currentLevel].status":
                FormHistoryStatus.COMPLETED, //update workflowOrder status
              "workflowOrder.$[nextLevel].status": FormHistoryStatus.PENDING,
              ...queryCriteria,
            },
            $push: {
              formHistory: {
                approvedBy: emailId,
                status: status,
                workflow: workflowId,
                workflowName: workflowHistoryName,
                department: department,
                departmentName: departmentName,
                createdAt: Date.now(),
                comments: comments,
                ...(behalfApprover
                  ? { behalfApprover: framebehalfApproverText }
                  : {}), // Conditionally add behalfApprover
              },
            },
          };
          const arrayFilters = [
            { "currentLevel.level": currentWorkflow.level },
            { "nextLevel.level": nextWorkflow.level },
          ];
          const options = {
            arrayFilters: arrayFilters,
          };
          await this.formDetailsRepo.findOneAndUpdate(
            updateQuery,
            update,
            options,
          );
          this.logger.log(
            `Headcount Form Approval updated in Db, email service will be initiated`,
          );

          const ccEmails: string[] = [];
          // Add createdBy to the CC list if it's not empty
          if (createdBy) {
            ccEmails.push(createdBy);
          }
          // Add roleReportingEmail to the CC list if it's defined
          if (roleReportingEmail && createdBy !== roleReportingEmail) {
            ccEmails.push(roleReportingEmail);
          }
          let emailStatus = EmailStatus.PENDINGAPPROVAL;
          if (isHeadOfPnCFinalApprover) {
            emailStatus = EmailStatus.NEWROLE_OR_BUDGET_PENDINGAPPROVAL;
          }
          this.logger.log(
            `Headcount Next approver Email is ${JSON.stringify(userEmails)}`,
          );
          await this.mailerCommonService.sendHeadCountAssociateEmail(
            mailRedirectPath,
            userEmails,
            code,
            emailStatus,
            departmentName,
            "",
            ccEmails,
          );
        } else {
          this.logger.log(`final approver headcount flow-code- ${code}`);
          const historyStatus = FormHistoryStatus.COMPLETED;
          const workflowOrderStatus = FormHistoryStatus.COMPLETED;

          const ccEmails: string[] = [];
          if (userEmails !== emailId) {
            ccEmails.push(emailId);
          }
          queryCriteria.status = historyStatus;
          await this.mailerCommonService.sendHeadCountAssociateEmail(
            mailRedirectPath,
            userEmails,
            code,
            historyStatus,
            departmentName,
            "",
            ccEmails,
          );

          const updateQuery = {
            _id: id,
            "workflowOrder.level": currentWorkflow.level,
          };
          const update = {
            $set: {
              "workflowOrder.$.status": workflowOrderStatus,
              ...queryCriteria,
            },
            $push: {
              formHistory: {
                approvedBy: emailId,
                status: historyStatus,
                workflow: workflowId,
                workflowName: workflowHistoryName,
                department: department,
                departmentName: departmentName,
                createdAt: Date.now(),
                comments: comments,
                isHeadOfPnCFinalApprover: headOfPnCFinalApproverFlag
                  ? headOfPnCFinalApproverFlag
                  : "",
                ...(behalfApprover
                  ? { behalfApprover: framebehalfApproverText }
                  : {}), // Conditionally add behalfApprover
              },
            },
          };
          await this.formDetailsRepo.findOneAndUpdate(updateQuery, update);
        }
      } else {
        this.logger.log(`Headcount Form will be enter rejection flow`);
        formMessage = "Form has been rejected.";
        const updateQuery = {
          _id: id,
          "workflowOrder.level": currentWorkflow.level,
        };
        const update = {
          $set: {
            "workflowOrder.$.status": FormHistoryStatus.REJECTED,
            status: status,
          },
          $push: {
            formHistory: {
              approvedBy: emailId,
              status: status,
              workflow: workflowId,
              workflowName: workflowHistoryName,
              department: department,
              departmentName: departmentName,
              createdAt: Date.now(),
              comments: comments,
              ...(behalfApprover
                ? { behalfApprover: framebehalfApproverText }
                : {}), // Conditionally add behalfApprover
            },
          },
        };

        await this.formDetailsRepo.findOneAndUpdate(updateQuery, update);

        const ccEmails: string[] = [];

        // Add createdBy to the CC list if it's not empty
        if (createdBy) {
          ccEmails.push(createdBy);
        }

        // Add roleReportingEmail to the CC list if it's defined
        if (roleReportingEmail && createdBy !== roleReportingEmail) {
          ccEmails.push(roleReportingEmail);
        }
        await this.mailerCommonService.sendHeadCountAssociateEmail(
          mailRedirectPath,
          ccEmails,
          code,
          EmailStatus.REJECTED,
          departmentName,
          comments,
        );
      }
      return { message: formMessage };
    }

    // if (!formDetailsModels) {
    throw new NotFoundException(`Form #${id} not found`);
    // }
  }
}
