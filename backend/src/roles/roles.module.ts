import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { RolesModel } from "./roles.model";
import { formModuleModel } from "../form-module/form-module.model";
import { DatabaseModule, DepartmentsRepository, PermissionsRepository, RolesRepository, UsersRepository, WorkflowRepository } from "@app/common";
import { PermissionsModel } from "@src/permissions/permissions.model";
import { UsersModel } from "@src/users/users.model";
import { HelperModule } from "@src/helper/helper.module";
import { DepartmentsModel } from "@src/departments/departments.model";
import { WorkflowModel } from "@src/workflow/workflow.model";

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: "Roles", schema: RolesModel },
      { name: "FormModule", schema: formModuleModel },
      { name: "Permissions", schema: PermissionsModel },
      { name: "Users", schema: UsersModel },
      { name: "Departments", schema: DepartmentsModel },
      { name: "Workflow", schema: WorkflowModel },
    ]),
    HelperModule
  ],
  providers: [RolesService, RolesRepository, PermissionsRepository, UsersRepository, DepartmentsRepository,WorkflowRepository],
  controllers: [RolesController],
})
export class RolesModule {}
