import { Module } from "@nestjs/common";

import { DepartmentsService } from "./departments.service";
import { DepartmentsController } from "./departments.controller";

import { DepartmentsModel } from "./departments.model";
import { RolesModel } from "../roles/roles.model";
import { formModuleModel } from "../form-module/form-module.model";
import { DatabaseModule, DepartmentsRepository, RolesRepository } from "@app/common";
import { HelperModule } from "@src/helper/helper.module";

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: "Departments", schema: DepartmentsModel },
      { name: "Roles", schema: RolesModel },
      { name: "FormModule", schema: formModuleModel },
      { name: "Roles", schema: RolesModel },
    ]),
    HelperModule
  ],
  providers: [DepartmentsService, DepartmentsRepository, RolesRepository],
  controllers: [DepartmentsController],
})
export class DepartmentsModule {}
