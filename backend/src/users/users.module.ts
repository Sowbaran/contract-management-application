import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

import { RolesModel } from "../roles/roles.model";
import { DepartmentsModel } from "../departments/departments.model";
import { UsersModel } from "./users.model";
import { PermissionsModel } from "../permissions/permissions.model";
import { formModuleModel } from "../form-module/form-module.model";
import { HelperModule } from "../helper/helper.module";
import {
  DatabaseModule,
  DepartmentsRepository,
  PermissionsRepository,
  RolesRepository,
  UsersRepository,
  FormModuleRepository,
} from "@app/common";

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: "Users", schema: UsersModel },
      { name: "Roles", schema: RolesModel },
      { name: "Departments", schema: DepartmentsModel },
      { name: "Permissions", schema: PermissionsModel },
      { name: "FormModule", schema: formModuleModel },
    ]),
    HelperModule
  ],
  providers: [
    UsersService,
    UsersRepository,
    DepartmentsRepository,
    RolesRepository,
    PermissionsRepository,
    FormModuleRepository,
    //HelperService
  ],
  controllers: [UsersController],
})
export class UsersModule {}
