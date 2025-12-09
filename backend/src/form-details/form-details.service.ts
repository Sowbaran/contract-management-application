import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import {
  ContractFormListResponseDto,
  CreateFormDto,
  CreateHeadCountResponseDto,
  CreateUpdateFormResponseDto,
  FilterMetaResponseDto,
  FormHistroyResponseDto,
  GetFormDetailResponseDto,
  UpdateFormDetailsDto,
  CreateHeadcountFormDto,
  HeadcountFormListResponseDto,
  GetHeadcountFormDetailResponseDto,
  UpdateHeadCountResponseDto,
  CreateDraftFormDto,
  CreateDraftFormResponseDto,
  ResetResponseDto,
  DeleteResponseDto,
  RecallResponseDto,
  GMDetailsResponseDto,
  GMErrorResponseDto,
} from "@src/form-details/dto";
import { MailerCommonService } from "@src/utils";
import {
  FormDetailsRepository,
  FormModuleRepository,
  UsersRepository,
  WorkflowRepository,
  RolesRepository,
} from "@app/common";
import {
  EmailStatus,
  FormHistoryStatus,
  FormStatus,
  ModuleCode,
  TabRequest,
  PermissionCodes,
  ROLECODES,
  headcountFilterStatus,
  financeFilterStatus,
  DocusignStatus,
  ApiCode,
  NotRequiredGM,
} from "../constants";
import { HelperService } from "../helper/helper.service";
import { Schema, Types } from "mongoose";
import { types } from "util";
import { plainToInstance } from "class-transformer";
import { Response } from "express";
import { FormDetails, WorkflowOrder } from "./formDetails.model";
import { Users } from "@src/users/users.model";
const converter = require("json-2-csv");

@Injectable()
export class FormDetailsService {
  protected readonly logger = new Logger(FormDetailsService.name);
  constructor(
    private formDetailsRepo: FormDetailsRepository,
    private workflowRepo: WorkflowRepository,
    private usersRepo: UsersRepository,
    private formModuleRepository: FormModuleRepository,
    private readonly mailerCommonService: MailerCommonService,
    private helperService: HelperService,
    private rolesRepo: RolesRepository,
  ) {}

  async createContract(
    createFormDto: CreateFormDto,
  ): Promise<CreateUpdateFormResponseDto> {
    const id = createFormDto.formId;
    let filteredWorkflowOrder: WorkflowOrder[] = [];
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let matchingWorkflows: any[] = [];
    const byPassWorkflow =
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      (createFormDto.formInfo as any).contract_tech_review?.toLowerCase() ===
      "no";
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const monetaryValue = (createFormDto.formInfo as any).monetary_value;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const deedOfNovation = (createFormDto.formInfo as any)
      .approval_being_sought;
    let specificApproverUser: Users | null = null;
    let specificApproverDetail: object = {};
    this.logger.log(`Contract Form Create service id- ${monetaryValue}`);
    const isDeedOfNovation = deedOfNovation === ROLECODES.DeedOfNovation;
    const formDetailCode = await this.formDetailsRepo.findOneExisting({
      code: createFormDto.code,
    });
    if (formDetailCode && !id) {
      throw new ConflictException("Form already exists!");
    }
    const formModulesDetails = await this.formModuleRepository.findOneExisting({
      _id: createFormDto.moduleId,
      status: true,
    });
    if (!formModulesDetails) {
      throw new NotFoundException(`Module Not Found. Kindly contact Admin`);
    }

    if (formModulesDetails.code !== ModuleCode.VENDORCONTRACT) {
      throw new NotFoundException(`Invalid Module`);
    }
    const query = { moduleId: createFormDto.moduleId, status: true };
    const projection = "_id workflowOrder";
    const currentWorkflow = await this.workflowRepo.findOne(query, projection);
    if (!currentWorkflow) {
      throw new NotFoundException(
        `No active workflow for this module. Kindly contact the admin`,
      );
    }
    this.logger.log(`Current Workflow: ${JSON.stringify(currentWorkflow)}`);

    const user = await this.usersRepo.findOneExisting(
      { email: createFormDto.createdBy },
      "departments",
    );
    if (createFormDto.specificApproverUserId) {
      if (createFormDto.specificApproverUserId === NotRequiredGM.name) {
        specificApproverUser = {
          name: NotRequiredGM.name,
          email: NotRequiredGM.name,
        } as Users;
      } else {
        specificApproverUser = await this.usersRepo.findOneExisting({
          _id: createFormDto.specificApproverUserId,
        });
      }

      specificApproverDetail = await this.helperService.getSpecificUserDetails(
        createFormDto.specificApproverUserId,
      );
    }

    const userRoles: string[] = [];
    if (user) {
      user.departments.forEach((dept) => {
        if (dept._id.toString() === createFormDto.department.toString()) {
          if (dept.roles) {
            dept.roles.forEach((role) => {
              // Safely check if moduleId exists and is an array
              if (role.status === true && Array.isArray(role.moduleId)) {
                // Check if the role includes the required moduleId
                if (
                  role.moduleId.some(
                    (id) => id.toString() === createFormDto.moduleId.toString(),
                  )
                ) {
                  userRoles.push(role._id.toString());
                }
              }
            });
          }
        }
      });
    }

    this.logger.log(`UserRoles Details: ${JSON.stringify(userRoles)}`);
    matchingWorkflows = currentWorkflow.workflowOrder.filter((workflow) => {
      const workflowRoleId = workflow.role.toString();

      // Exclude levels based on includeOnRequesterCheck if user is found
      if (user && workflow.includeOnRequesterCheck) {
        return !userRoles.includes(workflowRoleId);
      }
      // Include all levels for guest users where includeOnRequesterCheck is true
      if (!user && workflow.includeOnRequesterCheck) {
        return true;
      }
      // Filter by monetary value for workflows with limitFlag
      if (workflow.limitFlag) {
        if (!workflow.min) {
          this.logger.error("Minimum limit is not defined in the workflow");
          throw new InternalServerErrorException(
            "Minimum limit is not defined in the workflow",
          );
        }
        return monetaryValue >= workflow.min;
      }

      return true;
    });
    this.logger.log(`Matching Workflows: ${JSON.stringify(matchingWorkflows)}`);

    if (createFormDto.specificApproverUserId === NotRequiredGM.name) {
      matchingWorkflows = matchingWorkflows.filter(
        (item) => item.code !== "first-reviewer",
      );
    }
    if (isDeedOfNovation) {
      matchingWorkflows = currentWorkflow.workflowOrder.filter(
        (item) => item.deedOfNovation,
      );
    }

    if (byPassWorkflow) {
      matchingWorkflows = matchingWorkflows.filter(
        (item) => !item.byPassWorkflow,
      );
    }

    const workflowOrder = matchingWorkflows.map((workflow, index) => ({
      level: index + 1,
      roleId: workflow.role,
      name: workflow.name,
      code: workflow.code,
      limitFlag: workflow.limitFlag || false,
      min: workflow.min || 0,
      max: workflow.max || 0,
      status:
        index === 0 ? FormHistoryStatus.PENDING : FormHistoryStatus.UPCOMING,
      isSpecificDeptApprover: workflow.isSpecificDeptApprover || false,
      includeOnRequesterCheck: workflow.includeOnRequesterCheck || false,
      deedOfNovation: workflow.deedOfNovation,
      byPassWorkflow: workflow.byPassWorkflow,
    }));

    filteredWorkflowOrder = workflowOrder;
    this.logger.log(`WorkFlowOrder: ${JSON.stringify(filteredWorkflowOrder)}`);

    const roleId =
      (filteredWorkflowOrder[0].roleId as unknown as Types.ObjectId) ||
      filteredWorkflowOrder[0].roleId.toString();
    createFormDto.moduleCode = formModulesDetails.code;
    createFormDto.workflow = roleId;
    createFormDto.workflowName =
      filteredWorkflowOrder[0]?.name || matchingWorkflows[0]?.name;
    createFormDto.workflowVersion = currentWorkflow._id;

    const formHistory = {
      approvedBy: createFormDto.createdBy,
      status: FormHistoryStatus.INITIATED,
      workflow: createFormDto.workflow,
      workflowName: createFormDto.workflowName,
      department: createFormDto.department,
      departmentName: createFormDto.departmentName,
      createdAt: Date.now(),
      ...(createFormDto.specificApproverUserId &&
        specificApproverUser &&
        !isDeedOfNovation && {
          specificApproverName: specificApproverUser.name,
          specificApproverEmail: specificApproverUser.email,
        }),
    };

    // Get next approvers

    const userEmails =
      createFormDto.specificApproverUserId &&
      specificApproverUser &&
      createFormDto.specificApproverUserId !== NotRequiredGM.name &&
      !isDeedOfNovation
        ? specificApproverUser?.email
          ? [specificApproverUser.email]
          : []
        : await this.helperService.getNextApprovers(
            {
              departmentName: createFormDto.departmentName,
              department: createFormDto.department,
            },
            {
              roleId: filteredWorkflowOrder[0].roleId,
              roleName: createFormDto.workflowName,
              isSpecificDeptApprover:
                filteredWorkflowOrder[0].isSpecificDeptApprover,
            },
            createFormDto.moduleId.toString(),
            createFormDto.code,
            "createContractForm",
          );

    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let formRes;
    if (id) {
      // Check if form exists and is in DRAFT status
      const existingForm = await this.formDetailsRepo.findOneExisting({
        _id: id,
        active: true,
      });
      
      if (!existingForm) {
        throw new NotFoundException(`Form #${id} not found`);
      }

      // Ensure code is set from existing form if not provided in DTO
      if (!createFormDto.code && existingForm.code) {
        createFormDto.code = existingForm.code;
      }
      
      createFormDto.status = FormStatus.PENDING;
      const { formHistory, ...formDtoWithoutHistory } = createFormDto; // Exclude formHistory

      const updateQuery = { _id: id };
      const update = {
        $set: {
          ...formDtoWithoutHistory,
          workflowOrder: filteredWorkflowOrder, // Save the updated workflowOrder back to the form
          ...(createFormDto.specificApproverUserId && specificApproverUser
            ? {
                specificApproverDetails: specificApproverDetail,
              }
            : {}),
        },
        $push: {
          formHistory: {
            approvedBy: createFormDto.createdBy,
            status: FormHistoryStatus.INITIATED,
            workflow: createFormDto.workflow,
            workflowName: createFormDto.workflowName,
            department: createFormDto.department,
            departmentName: createFormDto.departmentName,
            createdAt: Date.now(),
            ...(createFormDto.specificApproverUserId &&
              specificApproverUser &&
              !isDeedOfNovation && {
                specificApproverName: specificApproverUser.name,
                specificApproverEmail: specificApproverUser.email,
              }),
          },
        },
      };
      formRes = await this.formDetailsRepo.findOneAndUpdate(
        updateQuery,
        update,
      );
      if (!formRes) {
        throw new NotFoundException(`Form #${id} not found`);
      }
      
      this.logger.log(
        `Draft form ${id} submitted - Status changed to PENDING, workflow initialized`,
      );
    } else {
      formRes = await this.formDetailsRepo.create({
        ...createFormDto,
        formHistory: [formHistory],
        workflowOrder: filteredWorkflowOrder,
        ...(createFormDto.specificApproverUserId && specificApproverUser
          ? {
              specificApproverDetails: specificApproverDetail,
            }
          : {}),
      });

      if (!formRes) {
        this.logger.error("Create New Form Error");
        throw new InternalServerErrorException("Create New Form Error");
      }
    }
    const formId = formRes._id;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const counterParty = (formRes.formInfo as any).counter_party;

    this.logger.log(
      `Form submit:${createFormDto.workflow}-${createFormDto.workflowName}:${createFormDto.department}-${createFormDto.departmentName}`,
    );

    const queryString = createFormDto.mailRedirectPath.replace(
      "formDetailId",
      formId.toString(),
    );
    if (userEmails.includes(createFormDto.createdBy)) {
      createFormDto.createdBy = "";
    }

    const mailRes = await this.mailerCommonService.sendAssociateEmail(
      queryString,
      userEmails,
      createFormDto.code,
      EmailStatus.PENDINGAPPROVAL,
      counterParty,
      "",
      createFormDto.createdBy,
    );
    this.logger.log(`Create Form Email Response:${mailRes}`);
    return { message: "Form has been submitted successfully!" };
  }

  async createDraftContract(
    createDraftFormDto: CreateDraftFormDto,
  ): Promise<CreateDraftFormResponseDto> {
    const id = createDraftFormDto.formId;
    let specificApproverUser: Users | null = null;
    let specificApproverDetail: object = {};
    const formDetailCode = await this.formDetailsRepo.findOneExisting({
      code: createDraftFormDto.code,
    });
    if (formDetailCode && !id) {
      throw new ConflictException("Form already exists!");
    }
    const formModulesDetails = await this.formModuleRepository.findOneExisting({
      _id: createDraftFormDto.moduleId,
      status: true,
    });
    if (!formModulesDetails) {
      throw new NotFoundException(`Module Not Found. Kindly contact Admin`);
    }
    if (formModulesDetails.code !== ModuleCode.VENDORCONTRACT) {
      throw new NotFoundException(`Invalid Module`);
    }
    if (createDraftFormDto.specificApproverUserId) {
      if (createDraftFormDto.specificApproverUserId === NotRequiredGM.name) {
        specificApproverUser = {
          name: NotRequiredGM.name,
          email: NotRequiredGM.name,
        } as Users;
      } else {
        specificApproverUser = await this.usersRepo.findOneExisting({
          _id: createDraftFormDto.specificApproverUserId,
        });
      }

      specificApproverDetail = await this.helperService.getSpecificUserDetails(
        createDraftFormDto.specificApproverUserId,
      );
    }
    const formHistory = {
      approvedBy: createDraftFormDto.createdBy,
      status: FormHistoryStatus.DRAFT,
      workflow: createDraftFormDto.workflow,
      workflowName: createDraftFormDto.workflowName,
      department: createDraftFormDto.department,
      departmentName: createDraftFormDto.departmentName,
      createdAt: Date.now(),
      ...(createDraftFormDto.specificApproverUserId &&
        specificApproverUser && {
          specificApproverName: specificApproverUser.name,
          specificApproverEmail: specificApproverUser.email,
        }),
    };
    if (id) {
      const { formHistory, ...formDtoWithoutHistory } = createDraftFormDto; // Exclude formHistory

      const updateQuery = { _id: id };
      const update = {
        $set: {
          ...formDtoWithoutHistory,
          ...(createDraftFormDto.specificApproverUserId && specificApproverUser
            ? {
                specificApproverDetails: specificApproverDetail,
              }
            : {}),
        },
        $push: {
          formHistory: {
            approvedBy: createDraftFormDto.createdBy,
            status: FormHistoryStatus.DRAFT,
            ...(createDraftFormDto.workflow && {
              workflow: createDraftFormDto.workflow,
            }),
            ...(createDraftFormDto.workflowName && {
              workflowName: createDraftFormDto.workflowName,
            }),
            ...(createDraftFormDto.department && {
              department: createDraftFormDto.department,
            }),
            ...(createDraftFormDto.departmentName && {
              departmentName: createDraftFormDto.departmentName,
            }),
            createdAt: Date.now(),
            ...(createDraftFormDto.specificApproverUserId &&
              specificApproverUser && {
                specificApproverName: specificApproverUser.name,
                specificApproverEmail: specificApproverUser.email,
              }),
          },
        },
      };
      const formRes = await this.formDetailsRepo.findOneAndUpdate(
        updateQuery,
        update,
      );
      if (!formRes) {
        throw new NotFoundException(`Form #${id} not found`);
      }
    } else {
      createDraftFormDto.status = FormStatus.DRAFT;
      const formRes = await this.formDetailsRepo.create({
        ...createDraftFormDto,
        formHistory: [formHistory],
        ...(createDraftFormDto.specificApproverUserId && specificApproverUser
          ? {
              specificApproverDetails: specificApproverDetail,
            }
          : {}),
      });
      if (!formRes) {
        this.logger.error("Create New Form Draft Error");
        throw new InternalServerErrorException("Create New Form Draft Error");
      }
    }

    return { message: "Draft Form has been submitted successfully!" };
  }

  async getContractFormList(
    emailId: string,
    type: string,
    moduleId: string,
  ): Promise<ContractFormListResponseDto> {
    if (!Object.values(TabRequest).includes(type)) {
      throw new BadRequestException("Invalid type");
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
    console.log("departments",departments);
    this.logger.log(
      `form List userDetails departments- ${userDetails ? JSON.stringify(userDetails.departments) : ""}`,
    );
    if (
      (!userDetails || departments.length === 0) &&
      type !== TabRequest.MYREQUEST
    ) {
      throw new ForbiddenException(`You do not have the required permissions`);
    }

    const permissionCode = this.helperService.getPermissionCode(
      type,
      moduleType,
    );

    this.logger.log(
      `Module Code: ${formModuleCode.code}, Permission Code: ${permissionCode}`,
    );

    const { queryCriteria } = await this.helperService.validateUserPermissions(
      emailId,
      type,
      departments,
      moduleCode,
      permissionCode,
      moduleId,
    );
    this.logger.log(JSON.stringify(queryCriteria));
    const sortCriteria = { _id: -1 };
    const formDetailsModels = await this.formDetailsRepo.find(queryCriteria, {
      select:
        "_id moduleId code department departmentName formInfo.counter_party formInfo.start_date formInfo.end_date formInfo.monetary_value workflow workflowName status createdBy createdAt specificApproverDetails workflowOrder",
      sort: sortCriteria,
    });
     //const roleCheckResult = await this.helperService.checkUserRoles(departments, moduleCode);
   
   
    //let filteredFormDetails: any[] = [];
    
    
    /*if (type === TabRequest.APPROVEREQUEST && !roleCheckResult.isSuperAdmin) {
      filteredFormDetails = formDetailsModels.filter((form) => {
        const hasMatchingStep = form.workflowOrder?.some(
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          (step: any) =>
            step.includeOnRequesterCheck === true &&
            step.status === FormStatus.PENDING,
        );

        if (hasMatchingStep) {
          // Exclude if email does not match
          return (
            form.specificApproverDetails &&
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (form.specificApproverDetails as any).email === emailId
          );
        }

        // Keep all other forms
        return true;
      });
    } else {
      filteredFormDetails = formDetailsModels;
    }*/

    const totalRowCount = formDetailsModels.length;
    return {
     // data: filteredFormDetails,
     data: formDetailsModels,
      meta: {
        pagination: { totalRowCount },
      },
    };
  }

  async getContractFormDetail(
    id: string,
    emailId: string,
    type: string,
    moduleId: string,
  ): Promise<GetFormDetailResponseDto> {
    this.logger.log(`Hit Contract Form Detils Services`);
    let isFinanceAdditionalQuestions = false;
    let isRecallFlag = false;
    let MSAflag = false;
    let isWorkflowReset = false;
    let isDocuSignRetrigger = false;
    let eSignRequired = false;
    let isFinalApprover = false;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let firsReviewer: any;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let firstReviewerDetails: any;

    const formDetailsModels = await this.getCommonFormDetails(
      id,
      emailId,
      type,
      moduleId,
      ModuleCode.VENDORCONTRACT,
    );

    const requesterName = formDetailsModels?.formInfo?.requester_name;
    const requesterEmail = formDetailsModels?.formInfo?.requester_email;
    const approvalBeingSought =
      formDetailsModels?.formInfo?.approval_being_sought;

    const {
      createdBy,
      status,
      workflowOrder,
      workflowName,
      formHistory,
      department,
    } = formDetailsModels;

    // Find the next workflow item with status "pending"
    if (formDetailsModels.status !== FormStatus.DRAFT) {
      const nextWorkflow = formDetailsModels.workflowOrder.find(
        (item: { status: string }) => item.status === FormStatus.PENDING,
      );
      //Check if we found a pending item and role as finace , and logged user role as finace
      if (
        nextWorkflow &&
        nextWorkflow.code === ROLECODES.FINANCEADMIN &&
        formDetailsModels.isFinanceAdditionalQuestions
      ) {
        isFinanceAdditionalQuestions = true;
      }

      MSAflag =
        type === TabRequest.MYREQUEST &&
        emailId === createdBy &&
        status === FormStatus.COMPLETED;
      isRecallFlag =
        type === TabRequest.MYREQUEST &&
        workflowOrder[0].status === FormStatus.PENDING;
      isWorkflowReset =
        type === TabRequest.ESIGNREQUEST &&
        formDetailsModels?.isWorkflowReset === true;

      isDocuSignRetrigger = type === TabRequest.ESIGNREQUEST;
      if (type === TabRequest.APPROVEREQUEST) {
        isFinalApprover =
          workflowOrder.length === 1
            ? workflowOrder[0].status === FormStatus.PENDING
            : workflowOrder[workflowOrder.length - 1].status ===
              FormStatus.PENDING;

        const approvalRequired =
          formDetailsModels?.formInfo?.approval_being_sought;
        eSignRequired = approvalRequired !== ROLECODES.NoSigning;
      }
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const formInfo = formDetailsModels.formInfo as any;
    const firstReviewerId = formInfo?.generalManager ?? null;

    if (
      firstReviewerId &&
      firstReviewerId.trim() !== "" &&
      firstReviewerId !== NotRequiredGM.name
    ) {
      firsReviewer = await this.usersRepo.findById(firstReviewerId);

      firstReviewerDetails = formDetailsModels.workflowOrder.find(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (item: any) =>
          item.code === ROLECODES.GENERALMANAGER &&
          item.status === FormStatus.PENDING,
      );
    }

    const isFirstReviewerEditFlag =
      !!emailId &&
      !!firsReviewer &&
      emailId === firsReviewer.email &&
      !!firstReviewerDetails &&
      firstReviewerDetails.code === ROLECODES.GENERALMANAGER &&
      firstReviewerDetails.status === FormStatus.PENDING;

    const data = {
      ...formDetailsModels,
      department: department,
      workflow: workflowName,
      requesterName: requesterName,
      requesterEmail: requesterEmail,
      isAdditionalAccess: isFinanceAdditionalQuestions,
      formHistory: formHistory || [],
      MSAflag,
      workflowDetails: workflowOrder || [],
      isRecallFlag,
      isWorkflowReset,
      isDocuSignRetrigger,
      eSignRequired,
      isFinalApprover,
      approvalBeingSought: approvalBeingSought,
      isFirstReviewerEditFlag: isFirstReviewerEditFlag,
    };

    const formDetail = plainToInstance(GetFormDetailResponseDto, data);
    return formDetail;
  }

  async updateContractForm(
    updateFormDetailsDto: UpdateFormDetailsDto,
    userEmailId: string,
  ): Promise<CreateUpdateFormResponseDto> {
    this.logger.log(
      `Contract Form Resubmit service id- ${updateFormDetailsDto.formId}`,
    );
    const id = updateFormDetailsDto.formId;
    const moduleId = updateFormDetailsDto.moduleId;
    const attachments = updateFormDetailsDto.attachments;
    const mailRedirectPath = updateFormDetailsDto.mailRedirectPath;
    let isFirstReviewer = false;
    let formDetailsModels: FormDetails | null = null;
    let userEmails: string[] = [];

    const user = await this.usersRepo.findOneExisting(
      { email: userEmailId },
      "departments",
    );

    const userRoles: string[] = [];
    if (user) {
      user.departments.forEach((dept) => {
        if (
          dept._id.toString() === updateFormDetailsDto.department.toString()
        ) {
          if (dept.roles) {
            dept.roles.forEach((role) => {
              // Safely check if moduleId exists and is an array
              if (role.status === true && Array.isArray(role.moduleId)) {
                // Check if the role includes the required moduleId
                if (
                  role.moduleId.some(
                    (id) => id.toString() === moduleId.toString(),
                  )
                ) {
                  userRoles.push(role.code);
                }
              }
            });
          }
        }
      });
    }

    if (userRoles.includes(ROLECODES.GENERALMANAGER)) {
      const firstReviewerFormDetails =
        await this.formDetailsRepo.findOneExisting({
          _id: id,
          moduleId: moduleId,
          active: true,
        });

      if (!firstReviewerFormDetails) {
        throw new NotFoundException(`Form with ID ${id} not found`);
      }

      isFirstReviewer =
        firstReviewerFormDetails.workflowOrder?.some(
          (item) => item.code === ROLECODES.GENERALMANAGER,
        ) ?? false;
    }

    if (isFirstReviewer) {
      formDetailsModels = await this.formDetailsRepo.findOneExisting({
        _id: id,
        moduleId: moduleId,
        active: true,
      });
    } else {
      formDetailsModels = await this.formDetailsRepo.findOneExisting({
        _id: id,
        createdBy: userEmailId,
        moduleId: moduleId,
        active: true,
      });
    }

    if (!formDetailsModels) {
      throw new NotFoundException(
        `User #${userEmailId} not allowed to perform this action`,
      );
    }
    const departmentName = formDetailsModels.departmentName;
    const workflowName = formDetailsModels.workflowName;
    const workflow = formDetailsModels.workflow;
    const department = formDetailsModels.department;
    const code = formDetailsModels.code;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const counterParty = (updateFormDetailsDto.formInfo as any).counter_party;
    const moduleCode = formDetailsModels.moduleCode;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const updatedWorkflow: any = workflow;
    const updatedWorkflowName: string = workflowName;
    const workflowOrder = formDetailsModels.workflowOrder;
    const firstReviewerworkflowOrder = JSON.parse(JSON.stringify(formDetailsModels.workflowOrder));

    if (moduleCode !== ModuleCode.VENDORCONTRACT) {
      throw new NotFoundException(`Invalid Module`);
    }

    if (!isFirstReviewer) {
      // Check for "Rejected" status in workflowOrder
      const rejectedIndex = workflowOrder.findIndex(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (workFlow: any) =>
          workFlow.roleId?.toString() === updatedWorkflow.toString() &&
          workFlow.status === FormHistoryStatus.REJECTED,
      );

      let isSpecificDeptApprover = false;
      this.logger.log(
        `Workflow status updated to 'pending' for level: ${workflowOrder[rejectedIndex].level}, isSpecificDeptApprover: ${isSpecificDeptApprover}`,
      );
      if (rejectedIndex !== -1) {
        isSpecificDeptApprover =
          workflowOrder[rejectedIndex].isSpecificDeptApprover;
        workflowOrder[rejectedIndex].status = FormHistoryStatus.PENDING;
      } else {
        throw new NotFoundException(
          `No matching workflow found with roleId: ${updatedWorkflow} and status: "Rejected"`,
        );
      }

      //todo email check logic
      // Get next approvers
      userEmails = await this.helperService.getNextApprovers(
        {
          departmentName: departmentName,
          department: department,
        },
        {
          roleId: updatedWorkflow,
          roleName: workflowName,
          isSpecificDeptApprover: isSpecificDeptApprover,
        },
        moduleId,
        code,
        "reSubmitContractForm",
      );  
   
      if (
        workflowOrder[0].includeOnRequesterCheck &&
        firstReviewerworkflowOrder[0].status === FormStatus.REJECTED
      ) { 
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const selectedEmail = (formDetailsModels?.specificApproverDetails as any)
          ?.email;
        if (selectedEmail) {
          userEmails = [selectedEmail];
        } else {
          this.logger.warn(
            "No email found in specificApproverDetails for First Reviewer",
          );
        }
      }
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const queryCriteriaLevel1: any = {
      status: FormStatus.PENDING,
      formInfo: isFirstReviewer
        ? {
            ...updateFormDetailsDto.formInfo,
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            requester_name: (formDetailsModels.formInfo as any).requester_name,
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            requester_email: (formDetailsModels.formInfo as any)
              .requester_email,
          }
        : updateFormDetailsDto.formInfo,
      attachments: attachments,
    };

    const updateQuery = { _id: id };
    const update = {
      $set: {
        ...queryCriteriaLevel1,
        workflowOrder, // Save the updated workflowOrder back to the form
      },
      $push: {
        formHistory: {
          approvedBy: userEmailId,
          status: FormHistoryStatus.INITIATED,
          workflow: updatedWorkflow,
          workflowName: updatedWorkflowName,
          department: department,
          departmentName: departmentName,
          createdAt: Date.now(),
          ...(isFirstReviewer && {
            comments: `Updated by First reviewer - ${userEmailId}`,
          }),
        },
      },
    };

    const updatedForm = await this.formDetailsRepo.findOneAndUpdate(
      updateQuery,
      update,
    );
    if (!updatedForm) {
      throw new NotFoundException(`Form #${id} not found`);
    }
    if (!isFirstReviewer) {
      const resubmitMailRedirectPath = mailRedirectPath.replace(
        "formDetailId",
        id.toString(),
      );

      console.log('🔔 About to send resubmit email...');
      console.log('Recipients:', userEmails);
      console.log('Contract Code:', code);
      
      await this.mailerCommonService.sendAssociateEmail(
        resubmitMailRedirectPath,
        userEmails,
        code,
        EmailStatus.RESUBMIT,
        counterParty,
      );
      
      console.log('✅ Resubmit email sent successfully!');
    }
    return { message: "Form has been resubmitted successfully!" };
  }

  async getFormHistory(id: string): Promise<FormHistroyResponseDto> {
    const getFormModule = await this.formDetailsRepo.findById(id);
    if (!getFormModule) {
      throw new NotFoundException(`Form #${id} not found`);
    }
    const data = getFormModule.formHistory;
    return { data };
  }
  async filterMeta(
    email: string,
    moduleId: string,
    type: string,
  ): Promise<FilterMetaResponseDto> {
    if (!Object.values(TabRequest).includes(type)) {
      throw new BadRequestException("Invalid type");
    }
    const formModulesDetails = await this.formModuleRepository.findOne({
      _id: moduleId,
      status: true,
    });
    if (!formModulesDetails) {
      throw new NotFoundException("Module Not Found. Kindly contact Admin");
    }
    const { code: moduleCode } = formModulesDetails;
    let status = Object.values(headcountFilterStatus);
    if (moduleCode === ModuleCode.VENDORCONTRACT) {
      status = Object.values(financeFilterStatus);
      if (type === TabRequest.MYREQUEST) {
        status = [...status, "draft"];
      }
    }

    if (
      type === TabRequest.APPROVEREQUEST ||
      type === TabRequest.ESIGNREQUEST
    ) {
      status = [];
    }

    // Fetch user details
    const userDetails = await this.usersRepo.findOneExisting(
      { email, status: true },
      { departments: 1 },
    );

    const departments = userDetails?.departments || [];
    if (
      (!userDetails || departments.length === 0) &&
      type !== TabRequest.MYREQUEST
    ) {
      throw new ForbiddenException(`You do not have the required permissions`);
    }
    let workflow = [];
    let department = [];

    if (type === TabRequest.MYREQUEST) {
      [workflow, department] =
        await this.helperService.fetchRolesAndDepartments(moduleId);
    } else if (
      type === TabRequest.TEAMREQUEST ||
      type === TabRequest.APPROVEREQUEST
    ) {
      const roleCheckResult = await this.helperService.checkUserRoles(
        departments,
        moduleCode,
      );
      const isAllAccess =
        roleCheckResult.isSuperAdmin || roleCheckResult.isModuleAdmin;
      const isAdditionalAccess = roleCheckResult.isFinanceAdmin;

      if (type === TabRequest.TEAMREQUEST) {
        if (isAllAccess || isAdditionalAccess) {
          [workflow, department] =
            await this.helperService.fetchRolesAndDepartments(moduleId);
        } else {
          const { userDepartments, userRoles } =
            this.helperService.extractUserRolesAndDepartments(departments);
          workflow = userRoles;
          department = userDepartments;
        }
      } else if (type === TabRequest.APPROVEREQUEST) {
        if (isAllAccess) {
          [workflow, department] =
            await this.helperService.fetchRolesAndDepartments(moduleId);
        } else {
          const { userDepartments, userRoles } =
            this.helperService.extractUserRolesAndDepartments(departments);
          workflow = userRoles;
          department = userDepartments;
        }
      }
    }
    if (type === TabRequest.ESIGNREQUEST) {
      [workflow, department] =
        await this.helperService.fetchRolesAndDepartments(moduleId);
    }
    if (type === TabRequest.MYAPPROVEDLIST) {
      [workflow, department] =
        await this.helperService.fetchRolesAndDepartments(moduleId);
    }

    return {
      status,
      workflow,
      department,
    };
  }

  async formReset(
    formId: string,
    email: string,
    moduleId: string,
    type: string,
  ): Promise<ResetResponseDto> {
    if (!Object.values(TabRequest).includes(type)) {
      throw new BadRequestException("Invalid type");
    }
    this.logger.log(`Form  Reset service- ${formId}`);
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
      email,
      status: true,
    });
    const departments = userDetails?.departments || [];
    this.logger.log(
      `form approve userDetails departments- ${userDetails ? JSON.stringify(userDetails.departments) : ""}`,
    );
    const permissionCode = this.helperService.getPermissionCode(
      TabRequest.ESIGNREQUEST,
      moduleType,
    );
    this.logger.log(
      `Module Code: ${formModuleCode.code}, Permission Code: ${permissionCode}`,
    );

    const { queryCriteria } = await this.helperService.validateUserPermissions(
      email,
      TabRequest.ESIGNREQUEST,
      departments,
      moduleCode,
      permissionCode,
      moduleId,
      formId.toString(),
      ApiCode.RESET,
    );
    this.logger.log(
      `Contract Form Reset queryCriteria ${JSON.stringify(queryCriteria)}`,
    );

    const formDetails =
      await this.formDetailsRepo.findOneExisting(queryCriteria);

    if (!formDetails) {
      throw new NotFoundException(
        `Form #${formId} not found or you do not have the required permissions`,
      );
    }

    const updateQuery = { _id: formId };
    const update = {
      $set: {
        signers: [],
        envelopeId: "",
        status: FormHistoryStatus.PENDING,
        updatedBy: email,
      },
      $push: {
        formHistory: {
          approvedBy: email,
          status: FormHistoryStatus.RESET,
          createdAt: Date.now(),
          envelopeId: formDetails.envelopeId,
        },
      },
    };

    const updatedForm = await this.formDetailsRepo.findOneAndUpdate(
      updateQuery,
      update,
    );
    if (!updatedForm) {
      throw new NotFoundException(`Form #${formId} not found`);
    }
    return { message: "The form has been Reset successfully" };
  }

  async deleteForm(
    formId: string,
    email: string,
    moduleId: string,
    comments?: string,
  ): Promise<DeleteResponseDto> {
    this.logger.log(`Form  Delete service- ${email}`);
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
      email,
      status: true,
    });
    const departments = userDetails?.departments || [];
    this.logger.log(
      `form delete userDetails- ${userDetails ? JSON.stringify(userDetails.departments) : ""}`,
    );
    const permissionCode = this.helperService.getPermissionCode(
      TabRequest.MYREQUEST,
      moduleType,
    );
    this.logger.log(
      `Module Code: ${formModuleCode.code}, Permission Code: ${permissionCode}`,
    );

    const { queryCriteria } = await this.helperService.validateUserPermissions(
      email,
      TabRequest.MYREQUEST,
      departments,
      moduleCode,
      permissionCode,
      moduleId,
      formId.toString(),
    );
    this.logger.log(
      `Contract Form delete queryCriteria ${JSON.stringify(queryCriteria)}`,
    );

    const existingForm = await this.formDetailsRepo.findOne(queryCriteria);
    if (!existingForm) {
      throw new NotFoundException("Form not found");
    }
    if (existingForm.status === FormStatus.DRAFT) {
      await this.formDetailsRepo.findOneAndDelete(queryCriteria);
      return { message: "Form has been successfully deleted" };
    } else if (existingForm.status === FormStatus.REJECTED) {
      const update = {
        $set: {
          active: false,
          updatedBy: email,
          status: FormStatus.DELETED,
        },
        $push: {
          formHistory: {
            approvedBy: email,
            status: FormStatus.DELETED,
            createdAt: Date.now(),
            commets: comments,
          },
        },
      };
      await this.formDetailsRepo.findOneAndUpdate(queryCriteria, update);
      return { message: "Form has been successfully deactivated" };
    } else {
      throw new BadRequestException("Not a valid form to delete");
    }
  }

  async recallForm(
    formId: string,
    email: string,
    moduleId: string,
    comments: string,
  ): Promise<RecallResponseDto> {
    this.logger.log(`Form  Recall service- ${email}`);
    const options = { select: "code -_id" };
    const formModuleCode = await this.formModuleRepository.findById(
      moduleId,
      options,
    );
    console.log("formModuleCode", formModuleCode);
    if (!formModuleCode) {
      throw new NotFoundException(`Module #${moduleId} not found`);
    }
    const { code: moduleCode } = formModuleCode;
    if (moduleCode !== ModuleCode.VENDORCONTRACT) {
      throw new NotFoundException(`Invalid Module`);
    }

    // Query to find the form with workflowOrder conditions
    const [formDetailsModel] = await this.formDetailsRepo.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(formId),
          moduleId: new Types.ObjectId(moduleId),
          createdBy: email,
          status: FormStatus.PENDING,
          active: true,
        },
      },
      {
        $addFields: {
          firstWorkflow: { $arrayElemAt: ["$workflowOrder", 0] }, // First workflowOrder entry
          restWorkflow: {
            $slice: ["$workflowOrder", 1, { $size: "$workflowOrder" }],
          }, // Rest of workflowOrder entries
        },
      },
      {
        $match: {
          "firstWorkflow.status": FormHistoryStatus.PENDING, // First index status must be "pending"
          $expr: {
            $eq: [
              {
                $size: {
                  $filter: {
                    input: "$restWorkflow",
                    as: "item",
                    cond: {
                      $eq: ["$$item.status", FormHistoryStatus.UPCOMING],
                    },
                  },
                },
              },
              { $size: "$restWorkflow" }, // All remaining indices must be "upcoming"
            ],
          },
        },
      },
    ]);
    const workflowOrder = formDetailsModel.workflowOrder || [];
    const versionToSet =
      formDetailsModel.version === "V1" ? "V2" : formDetailsModel.version;
    this.logger.log(`Form Recall data ${JSON.stringify(formDetailsModel)}`);
    const code = formDetailsModel.code;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const counterParty = (formDetailsModel.formInfo as any).counter_party;
    if (!formDetailsModel) {
      throw new NotFoundException(
        `Form #${formId} not found, not in the correct workflow state, or you do not have the required permissions`,
      );
    }

    // Step 2: Update status to "draft" and set updatedBy
    const query = {
      _id: formId,
      createdBy: email,
      status: FormStatus.PENDING,
      active: true,
    };
    const update = {
      $set: {
        status: FormStatus.DRAFT,
        updatedBy: email,
        workflowOrder: [],
        workflowName: "",
        workflow: null,
        workflowVersion: null,
        version: versionToSet,
      },
      $push: {
        formHistory: {
          approvedBy: email,
          status: EmailStatus.RECALL,
          createdAt: Date.now(),
          comments: comments,
        },
      },
    };
    await this.formDetailsRepo.findOneAndUpdate(query, update);

    // Step 3: Collect emails based on workflowOrder.roleId    // biome-ignore lint/style/useConst: <explanation>
    let emailsToNotify: string[] = [];

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const queryCriteria: any = { status: true };

    if (workflowOrder[0].isSpecificDeptApprover) {
      if (
        workflowOrder[0].includeOnRequesterCheck &&
        workflowOrder[0].status === FormStatus.PENDING
      ) {
        //  First Reviewer → Notify only the selected approver from specificApproverDetails
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const selectedEmail = (formDetailsModel?.specificApproverDetails as any)
          ?.email;
        if (selectedEmail) {
          emailsToNotify = [selectedEmail];
        } else {
          this.logger.warn(
            "No email found in specificApproverDetails for First Reviewer",
          );
        }
      } else {
        // Specific department approver logic
        const key = "departments";
        queryCriteria[key] = {
          $elemMatch: {
            _id: formDetailsModel.department,
            roles: {
              $elemMatch: {
                _id: workflowOrder[0].roleId,
                moduleId: moduleId,
                status: true,
              },
            },
          },
        };
        const userWithEmails = await this.usersRepo.find(
          queryCriteria,
          "email -_id",
        );
        emailsToNotify = userWithEmails.map((u: { email: string }) => u.email);
      }
    } else {
      // Non-specific department approver logic
      queryCriteria["departments.roles"] = {
        $elemMatch: {
          _id: workflowOrder[0].roleId,
          moduleId: moduleId,
          status: true,
        },
      };
      const userWithEmails = await this.usersRepo.find(
        queryCriteria,
        "email -_id",
      );
      emailsToNotify = userWithEmails.map((u: { email: string }) => u.email);
    }

    console.log("emailsToNotify", emailsToNotify);
    if (emailsToNotify.length > 0) {
      const mailRes =
        await this.mailerCommonService.sendContractRecallAssociateEmail(
          emailsToNotify,
          code,
          EmailStatus.RECALL,
          counterParty,
          email,
          comments,
        );
    }

    return {
      message:
        "The form has been successfully recalled and all users have been notified.",
    };
  }

  async getGMdetails(
    email: string,
    moduleId: string,
    deptId: string,
  ): Promise<GMDetailsResponseDto> {
    try {
      this.logger.log(`Form GM check service- ${email}`);
      // Check if the user has the 'general-manager' role in the given department & module
      const user = await this.usersRepo.find({
        email: email,
        departments: {
          $elemMatch: {
            _id: deptId,
            roles: {
              $elemMatch: {
                code: ROLECODES.GENERALMANAGER,
                moduleId: { $in: [moduleId] },
              },
            },
          },
        },
      });

      this.logger.log(`User with gm role: ${user}`);
      // If a user is found, return an empty array
      if (user && Object.keys(user).length !== 0) {
        return { message: "The user itself is GM", data: [] };
      }

      // If no user is found, fetch all users with the 'general-manager' role in the department & module
      const gmUsers = await this.usersRepo.find({
        departments: {
          $elemMatch: {
            _id: deptId,
            roles: {
              $elemMatch: {
                code: ROLECODES.GENERALMANAGER,
                moduleId: { $in: [moduleId] },
              },
            },
          },
        },
      });

      if (!gmUsers || gmUsers.length === 0) {
        return {
          message: "GM users are been retrived",
          data: [
            {
              userId: NotRequiredGM.name,
              userName: NotRequiredGM.name,
              email: NotRequiredGM.name,
            },
          ],
        };
      }

      // Map the response to return required fields
      this.logger.log(`GM users for this department- ${gmUsers}`);
      return {
        message: "GM users are been retrived",
        data: [
          ...gmUsers.map((gm) => ({
            userId: gm._id.toString(),
            userName: gm.name,
            email: gm.email,
          })),
          {
            userId: NotRequiredGM.name,
            userName: NotRequiredGM.name,
            email: NotRequiredGM.name,
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching GM details:", error);
      throw new Error("Failed to fetch general managers");
    }
  }

  async updateMonetaryValueField(batchSize = 50): Promise<void> {
    try {
      this.logger.log("Starting data fix for monetary_value field...");
      let totalUpdated = 0;
      let totalSkipped = 0;
      let start = 0;
      while (true) {
        // Fetch a batch of documents with monetary_value as a string
        const queryCriteria = {
          "formInfo.monetary_value": { $type: "string" },
        };
        const documents = await this.formDetailsRepo.find(queryCriteria, {
          select: "formInfo _id",
          sort: { createdAt: -1 },
          skip: start,
          limit: batchSize,
        });
        if (documents.length === 0) {
          // Break the loop if no more documents to process
          break;
        }
        this.logger.log(`Processing batch of ${documents.length} documents...`);
        for (const document of documents) {
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          const monetaryValueString = (document.formInfo as any).monetary_value;
          const monetaryValueInt = Number.parseFloat(monetaryValueString);

          if (!Number.isNaN(monetaryValueInt)) {
            // Update the document in the database
            await this.formDetailsRepo.findOneAndUpdate(
              { _id: document._id },
              { $set: { "formInfo.monetary_value": monetaryValueInt } },
            );
            this.logger.log(`Updated document with _id: ${document._id}`);
            totalUpdated++;
          } else {
            this.logger.warn(
              `Skipping document with _id: ${document._id} due to invalid monetary_value.`,
            );
            totalSkipped++;
          }
        }
        start += batchSize;
      }
      this.logger.log(
        `Data fix completed successfully. Total updated: ${totalUpdated}, Total skipped: ${totalSkipped}.`,
      );
    } catch (error) {
      this.logger.error("Error while running data fix:", error);
    }
  }

  async createHeadcount(
    createHeadcountFormDto: CreateHeadcountFormDto,
  ): Promise<CreateUpdateFormResponseDto> {
    const { formModulesDetails, currentWorkflow } =
      await this.validateModuleAndWorkflow(createHeadcountFormDto.moduleId);
    await this.validateDuplicateForm(createHeadcountFormDto.code);
    const userRoles = await this.getUserRoles(
      createHeadcountFormDto.createdBy,
      createHeadcountFormDto.department,
      createHeadcountFormDto.moduleId,
    );

    const matchingWorkflows = this.getMatchingWorkflows(
      currentWorkflow,
      userRoles,
    );

    const workflowOrder = this.prepareHeadcountWorkflowOrder(
      matchingWorkflows,
      createHeadcountFormDto.formInfo,
    );

    Object.assign(createHeadcountFormDto, {
      moduleCode: formModulesDetails.code,
      workflow: matchingWorkflows[0].role,
      workflowName: matchingWorkflows[0].name,
      workflowVersion: currentWorkflow._id,
    });

    const formHistory = this.createFormHistory(createHeadcountFormDto);
    // Get next approvers
    const userEmails = await this.helperService.getNextApprovers(
      {
        departmentName: createHeadcountFormDto.departmentName,
        department: createHeadcountFormDto.department,
      },
      {
        roleId: matchingWorkflows[0].role,
        roleName: matchingWorkflows[0].name,
        isSpecificDeptApprover: matchingWorkflows[0].isSpecificDeptApprover,
      },
      createHeadcountFormDto.moduleId.toString(),
      createHeadcountFormDto.code,
      "createHeadcountForm",
    );

    // Create form
    const formRes = await this.formDetailsRepo.create({
      ...createHeadcountFormDto,
      formHistory: [formHistory],
      workflowOrder,
    });

    if (!formRes)
      throw new InternalServerErrorException("Create New Form Error");

    // Handle email sending
    await this.sendApprovalEmails(
      formRes,
      createHeadcountFormDto,
      userEmails,
      EmailStatus.PENDINGAPPROVAL,
    );
    return { message: "Form has been submitted successfully!" };
  }

  async getHeadcountFormList(
    emailId: string,
    type: string,
    moduleId: string,
  ): Promise<HeadcountFormListResponseDto> {
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
    const moduleType = moduleCode.toUpperCase() as keyof typeof PermissionCodes;
    const userDetails = await this.usersRepo.findOneExisting({
      email: emailId,
      status: true,
    });
    const departments = userDetails?.departments || [];
    this.logger.log(
      `Headcount form List userDetails departments- ${userDetails ? JSON.stringify(userDetails.departments) : ""}`,
    );
    if (
      (!userDetails || departments.length === 0) &&
      type !== TabRequest.MYREQUEST
    ) {
      throw new ForbiddenException(`You do not have the required permissions`);
    }

    const permissionCode = this.helperService.getPermissionCode(
      type,
      moduleType,
    );

    this.logger.log(
      `Module Code: ${formModuleCode.code}, Permission Code: ${permissionCode}`,
    );

    const { queryCriteria } = await this.helperService.validateUserPermissions(
      emailId,
      type,
      departments,
      moduleCode,
      permissionCode,
      moduleId,
    );
    this.logger.log(JSON.stringify(queryCriteria));
    const sortCriteria = { _id: -1 };
    const formDetailsModels = await this.formDetailsRepo.find(queryCriteria, {
      select:
        "_id moduleId code department departmentName formInfo.role_name workflow workflowName status createdBy createdAt",
      sort: sortCriteria,
    });
    const totalRowCount = formDetailsModels.length;
    return {
      data: formDetailsModels,
      meta: {
        pagination: { totalRowCount },
      },
    };
  }

  async getHeadcountFormDetail(
    id: string,
    emailId: string,
    type: string,
    moduleId: string,
  ): Promise<GetHeadcountFormDetailResponseDto> {
    this.logger.log(`Hit Headcunt Form Detils Services`);
    const formDetailsModels = await this.getCommonFormDetails(
      id,
      emailId,
      type,
      moduleId,
      ModuleCode.HEADCOUNTREQUEST,
    );
    const { workflowOrder, departmentName, workflowName, formHistory } =
      formDetailsModels;
    const requesterName = formDetailsModels?.formInfo?.requester_name;
    const requesterEmail = formDetailsModels?.formInfo?.requester_email;
    let isHeadOfPnCFinalApproverFlag = false;
    const workflowCount = workflowOrder.length - 1;
    const currentStatus = workflowOrder[workflowCount].status;
    if (
      workflowOrder[workflowCount].isHeadOfPnCFinalApprover &&
      currentStatus === FormHistoryStatus.PENDING
    ) {
      isHeadOfPnCFinalApproverFlag = true;
    }
    const data = {
      ...formDetailsModels,
      department: departmentName,
      workflow: workflowName,
      requesterName: requesterName,
      requesterEmail: requesterEmail,
      formHistory: formHistory || [],
      workflowDetails: workflowOrder || [],
      isHeadOfPnCFinalApprover: isHeadOfPnCFinalApproverFlag,
    };

    const formDetail = plainToInstance(GetHeadcountFormDetailResponseDto, data);
    return formDetail;
  }

  async updateHeadCountForm(
    updateFormDetailsDto: UpdateFormDetailsDto,
    userEmailId: string,
  ): Promise<UpdateHeadCountResponseDto> {
    // Fetch existing form
    const formDetails = await this.formDetailsRepo.findOneExisting({
      _id: updateFormDetailsDto.formId,
      createdBy: userEmailId,
      moduleId: updateFormDetailsDto.moduleId,
      active: true,
    });

    if (!formDetails)
      throw new NotFoundException(
        `User #${userEmailId} not allowed to perform this action`,
      );

    // Prepare updated workflow details
    const workflowOrder = this.prepareHeadcountWorkflowOrder(
      formDetails.workflowOrder,
      updateFormDetailsDto.formInfo,
    );
    const level1Order = workflowOrder.find((order) => order.level === 1);
    if (!level1Order) throw new NotFoundException(`Level 1 Order not found`);

    // Prepare update query
    const updateQuery = { _id: updateFormDetailsDto.formId };
    const updateData = {
      $set: {
        status: FormStatus.PENDING,
        formInfo: updateFormDetailsDto.formInfo,
        attachments: updateFormDetailsDto.attachments,
        workflow: level1Order.roleId,
        workflowName: level1Order.name,
        workflowOrder,
      },
      $push: {
        formHistory: this.createFormHistory({
          ...updateFormDetailsDto,
          workflow: level1Order.roleId,
          workflowName: level1Order.name,
        }),
      },
    };

    // Get next approvers
    const userEmails = await this.helperService.getNextApprovers(
      {
        departmentName: formDetails.departmentName,
        department: formDetails.department,
      },
      {
        roleId: level1Order.roleId,
        roleName: level1Order.name,
        isSpecificDeptApprover: level1Order.isSpecificDeptApprover,
      },
      updateFormDetailsDto.moduleId.toString(),
      updateFormDetailsDto.code,
      "updateHeadcountForm",
    );
    // Update form
    const updatedForm = await this.formDetailsRepo.findOneAndUpdate(
      updateQuery,
      updateData,
    );
    if (!updatedForm)
      throw new NotFoundException(
        `Form #${updateFormDetailsDto.formId} not found`,
      );

    await this.sendApprovalEmails(
      updatedForm,
      updateFormDetailsDto,
      userEmails,
      EmailStatus.RESUBMIT,
    );

    return { message: "Form has been resubmitted successfully!" };
  }

  //Headcount Create and Resubmit common code
  private async validateModuleAndWorkflow(moduleId: Types.ObjectId) {
    const formModulesDetails = await this.formModuleRepository.findOneExisting({
      _id: moduleId,
      status: true,
    });
    if (!formModulesDetails)
      throw new NotFoundException(`Module Not Found. Kindly contact Admin`);

    if (formModulesDetails.code !== ModuleCode.HEADCOUNTREQUEST)
      throw new NotFoundException(`Invalid Module`);

    const currentWorkflow = await this.workflowRepo.findOne(
      { moduleId, status: true },
      "_id workflowOrder",
    );
    if (!currentWorkflow)
      throw new NotFoundException(
        `No active workflow for this module. Kindly contact the admin`,
      );

    return { formModulesDetails, currentWorkflow };
  }

  private async validateDuplicateForm(code: string) {
    const existingForm = await this.formDetailsRepo.findOneExisting({ code });
    if (existingForm) throw new ConflictException("Form already exists!");
  }

  private async getUserRoles(
    userEmail: string,
    department: Types.ObjectId,
    moduleId: Types.ObjectId,
  ): Promise<string[]> {
    const user = await this.usersRepo.findOneExisting(
      { email: userEmail },
      "departments",
    );
    if (!user) return [];

    return user.departments
      .filter((dept) => dept._id.toString() === department.toString())
      .flatMap((dept) => dept.roles || [])
      .filter(
        (role) =>
          Array.isArray(role.moduleId) &&
          role.moduleId.some((id) => id.toString() === moduleId.toString()),
      )
      .map((role) => role._id.toString());
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private getMatchingWorkflows(currentWorkflow: any, userRoles: string[]) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return currentWorkflow.workflowOrder.filter((workflow: any) => {
      if (workflow.includeOnRequesterCheck)
        return !userRoles.includes(workflow.role.toString());
      return true;
    });
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private prepareHeadcountWorkflowOrder(workflows: any[], formInfo: any) {
    const isHeadOfPnCFinalApprover =
      formInfo.is_role_in_budget === "No" ||
      formInfo.is_new_role_or_replacement === "New Role";

    return workflows.map((workflow, index, array) => ({
      level: workflow.level,
      roleId: workflow.role ? workflow.role : workflow.roleId,
      name: workflow.name,
      code: workflow.code,
      isSpecificDeptApprover: workflow.isSpecificDeptApprover || false,
      includeOnRequesterCheck: workflow.includeOnRequesterCheck || false,
      status:
        index === 0 ? FormHistoryStatus.PENDING : FormHistoryStatus.UPCOMING,
      isHeadOfPnCFinalApprover:
        index === array.length - 1 ? isHeadOfPnCFinalApprover : false,
    }));
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private createFormHistory(data: any) {
    return {
      approvedBy: data.createdBy,
      status: FormHistoryStatus.INITIATED,
      workflow: data.workflow,
      workflowName: data.workflowName,
      department: data.department,
      departmentName: data.departmentName,
      createdAt: Date.now(),
    };
  }

  private async sendApprovalEmails(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    formRes: any,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    formDto: any,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    userEmails: any,
    emailStatus: string,
  ) {
    const queryString = formDto.mailRedirectPath.replace(
      "formDetailId",
      formRes._id.toString(),
    );
    if (userEmails.includes(formDto.createdBy)) formDto.createdBy = "";

    const ccEmails = [];
    if (formDto.createdBy) ccEmails.push(formDto.createdBy);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const roleReportingEmail = (formRes.formInfo as any).role_reporting_email;
    if (roleReportingEmail && formDto.createdBy !== roleReportingEmail)
      ccEmails.push(roleReportingEmail);

    await this.mailerCommonService.sendHeadCountAssociateEmail(
      queryString,
      userEmails,
      formDto.code,
      emailStatus,
      formDto.departmentName,
      "",
      ccEmails,
    );
  }

  //Vendor and headcount form details common code
  private async getCommonFormDetails(
    id: string,
    emailId: string,
    type: string,
    moduleId: string,
    expectedModuleCode: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ): Promise<any> {
    const options = { select: "code -_id" };
    const formModuleCode = await this.formModuleRepository.findById(
      moduleId,
      options,
    );
    if (!formModuleCode) {
      throw new NotFoundException(`Module #${moduleId} not found`);
    }
    const { code: moduleCode } = formModuleCode;
    if (moduleCode !== expectedModuleCode) {
      throw new NotFoundException(`Invalid Module`);
    }

    const moduleType = moduleCode.toUpperCase() as keyof typeof PermissionCodes;
    const userDetails = await this.usersRepo.findOneExisting({
      email: emailId,
      status: true,
    });

    const departments = userDetails?.departments || [];
    this.logger.log(
      `${expectedModuleCode}- form List userDetails departments- ${userDetails ? JSON.stringify(userDetails.departments) : ""}`,
    );

    const permissionCode = this.helperService.getPermissionCode(
      type,
      moduleType,
    );
    this.logger.log(
      `${expectedModuleCode}- Module Code: ${moduleCode}, Permission Code: ${permissionCode}`,
    );

    const { queryCriteria, isAdditionalAccess, isAllAccess } =
      await this.helperService.validateUserPermissions(
        emailId,
        type,
        departments,
        moduleCode,
        permissionCode,
        moduleId,
        id,
      );

    const formDetailsModels =
      await this.formDetailsRepo.findOneExisting(queryCriteria);
    if (!formDetailsModels) {
      throw new ForbiddenException(
        "You do not have permission to access this form or it does not exist.",
      );
    }

    this.logger.log(`${expectedModuleCode}- ${JSON.stringify(queryCriteria)}`);
    return {
      ...formDetailsModels,
      isFinanceAdditionalQuestions: isAdditionalAccess,
      isWorkflowReset: isAllAccess,
    };
  }

  async flattenObject(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    obj: any,
    parentKey = "",
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    result: Record<string, any> = {},
  ) {
    for (const [key, value] of Object.entries(obj)) {
      const newKey = parentKey ? `${parentKey}_${key}` : key; // Create a flat key

      if (typeof value === "object" && value !== null) {
        if (Array.isArray(value)) {
          // Convert arrays to comma-separated strings
          result[newKey] = value
            .map((v) => (typeof v === "object" ? JSON.stringify(v) : v))
            .join(", ");
        } else if ("$oid" in value) {
          result[newKey] = value.$oid; // Extract ObjectId
        } else if ("$date" in value) {
          //result[newKey] = new Date(value.$date).toISOString(); // Convert date
        } else if ("$numberLong" in value) {
          result[newKey] = value.$numberLong; // Convert numberLong
        } else {
          // Recursively flatten nested objects
          this.flattenObject(value, newKey, result);
        }
      } else {
        result[newKey] = value; // Copy primitive values
      }
    }
    return result;
  }

  async exportFormsToCSV(res: Response): Promise<void> {
    try {
      // Fetch all users from MongoDB
      const forms = await this.formDetailsRepo.find({});

      if (!forms || forms.length === 0) {
        res.status(404).json({ message: "No users found" });
        return;
      }

      const filteredData = forms.map((form) => ({
        id: form._id.toString(),
        module_identifier: form.moduleId.toString(),
        form_code: form.code,
        form_information: JSON.stringify(form.formInfo),
        department_id: form.department.toString(),
        department_name: form.departmentName,
        workflow_id: form.workflow.toString(),
        workflow_title: form.workflowName,
        attachments: form.attachments,
        msaAttachments: form.msaAttachments,

        form_status: form.status,
        creator_email: form.createdBy,
      }));

      const csv = await converter.json2csv(filteredData);

      // Set response headers for file download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=forms.csv");

      // Send CSV data as response
      res.send(csv);
    } catch (error) {
      console.error("Error exporting users:", error);
      res.status(500).json({ message: "Error exporting users" });
    }
  }
}
