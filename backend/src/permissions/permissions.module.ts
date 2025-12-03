import { Module } from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { PermissionsController } from "./permissions.controller";
import { PermissionsModel } from "./permissions.model";
import {
  DatabaseModule,
  FormModuleRepository,
  PermissionsRepository,
  RolesRepository,
} from "@app/common";
import { formModuleModel } from "@src/form-module/form-module.model";
import { HelperModule } from "@src/helper/helper.module";
import { RolesModel } from "@src/roles/roles.model";

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: "Permissions", schema: PermissionsModel },
      { name: "FormModule", schema: formModuleModel },
       { name: "Roles", schema: RolesModel },
    ]),
    HelperModule
  ],
  providers: [PermissionsService, PermissionsRepository, FormModuleRepository, RolesRepository],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
