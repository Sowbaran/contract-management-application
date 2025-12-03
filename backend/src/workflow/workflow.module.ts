import { Module } from "@nestjs/common";
import { WorkflowService } from "./workflow.service";
import { WorkflowController } from "./workflow.controller";
import { UsersModel } from "../users/users.model";
import { DepartmentsModel } from "../departments/departments.model";
import { RolesModel } from "../roles/roles.model";
import { WorkflowModel } from "./workflow.model";
import { formModuleModel } from "../form-module/form-module.model";
import { DatabaseModule, WorkflowRepository, RolesRepository, FormModuleRepository, UsersRepository } from "@app/common";
import { HelperModule } from "../helper/helper.module";
@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: "Users", schema: UsersModel },
      { name: "Departments", schema: DepartmentsModel },
      { name: "Roles", schema: RolesModel },
      { name: "Workflow", schema: WorkflowModel },
      { name: "FormModule", schema: formModuleModel },
    ]),
    HelperModule
  ],
  providers: [WorkflowService, WorkflowRepository, RolesRepository, FormModuleRepository, UsersRepository],
  controllers: [WorkflowController],
})
export class WorkflowModule {}
