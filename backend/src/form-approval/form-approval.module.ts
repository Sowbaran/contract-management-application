import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { FormApprovalService } from "./form-approval.service";
import { FormApprovalController } from "./form-approval.controller";
import { formDetailsModel } from "../form-details/formDetails.model";
import { DepartmentsModel } from "../departments/departments.model";
import { WorkflowModel } from "../workflow/workflow.model";
import { UsersModel } from "../users/users.model";
import { RolesModel } from "../roles/roles.model";
import { formModuleModel } from "../form-module/form-module.model";
import { EmailModule } from "../email/email.module";
import { MailerCommonService } from "../utils";
import { HelperModule } from "../helper/helper.module";
import {
  DatabaseModule,
  DepartmentsRepository,
  FormDetailsRepository,
  FormModuleRepository,
  RolesRepository,
  UsersRepository,
  WorkflowRepository,
} from "@app/common";
import { SecretModule } from "../secret/secret.module";

@Module({
  imports: [
    HttpModule,
    SecretModule,
    DatabaseModule.forFeature([
      { name: "FormDetails", schema: formDetailsModel },
      { name: "FormModule", schema: formModuleModel },
      { name: "Roles", schema: RolesModel },
      { name: "Users", schema: UsersModel },
      { name: "Workflow", schema: WorkflowModel },
      { name: "Departments", schema: DepartmentsModel },
    ]),
    EmailModule,
    HelperModule
  ],

  providers: [
    FormApprovalService,
    MailerCommonService,
    FormDetailsRepository,
    UsersRepository,
    RolesRepository,
    DepartmentsRepository,
    FormModuleRepository,
    WorkflowRepository,
  ],
  controllers: [FormApprovalController],
  exports: [FormApprovalService],
})
export class FormApprovalModule {}
