import { Module } from "@nestjs/common";
import { formDetailsModel } from "./formDetails.model";
import { FormDetailsService } from "./form-details.service";
import { FormDetailsController } from "./form-details.controller";
import { WorkflowModel } from "../workflow/workflow.model";
import { UsersModel } from "../users/users.model";
import { RolesModel } from "../roles/roles.model";
import { formModuleModel } from "../form-module/form-module.model";
import { EmailModule } from "../email/email.module";
import { MailerCommonService } from "@src/utils";
import { HelperModule } from "../helper/helper.module";
import {
  DatabaseModule,
  FormDetailsRepository,
  FormModuleRepository,
  RolesRepository,
  UsersRepository,
  WorkflowRepository,
} from "@app/common";

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: "FormDetails", schema: formDetailsModel },
      { name: "Roles", schema: RolesModel },
      { name: "Users", schema: UsersModel },
      { name: "Workflow", schema: WorkflowModel },
      { name: "FormModule", schema: formModuleModel },
    ]),
    EmailModule,
    HelperModule
  ],

  providers: [
    FormDetailsService,
    FormDetailsRepository,
    WorkflowRepository,
    UsersRepository,
    RolesRepository,
    MailerCommonService,
    FormModuleRepository,
  ],
  controllers: [FormDetailsController],
  exports: [FormDetailsService],
})
export class FormDetailsModule {}
