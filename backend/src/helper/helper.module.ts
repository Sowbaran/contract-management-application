import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { DatabaseModule, FormDetailsRepository, WorkflowRepository, UsersRepository, RolesRepository, FormModuleRepository, DepartmentsRepository, PermissionsRepository } from '@app/common';
 
import { formDetailsModel } from '@src/form-details/formDetails.model';
import { formModuleModel } from '@src/form-module/form-module.model';
import { RolesModel } from '@src/roles/roles.model';
import { UsersModel } from '@src/users/users.model';
import { WorkflowModel } from '@src/workflow/workflow.model';
import { DepartmentsModel } from "../departments/departments.model";
import { PermissionsModel } from '@src/permissions/permissions.model';
@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: "FormDetails", schema: formDetailsModel },
      { name: "Roles", schema: RolesModel },
      { name: "Users", schema: UsersModel },
      { name: "Workflow", schema: WorkflowModel },
      { name: "FormModule", schema: formModuleModel },
      { name: "Departments", schema: DepartmentsModel },
      { name: "Permissions", schema: PermissionsModel },
    ])    
  ],

  providers: [
    PermissionsRepository,
    FormDetailsRepository,
    WorkflowRepository,
    UsersRepository,
    RolesRepository,
    FormModuleRepository,
    DepartmentsRepository,
    HelperService
  ],
  
  exports: [HelperService],
})
export class HelperModule {}
