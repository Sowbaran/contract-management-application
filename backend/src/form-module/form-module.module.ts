import { Module } from "@nestjs/common";

import { FormModuleService } from "./form-module.service";
import { FormModuleController } from "./form-module.controller";

import { formModuleModel } from "./form-module.model";

import { EmailModule } from "../email/email.module";
import { MailerCommonService } from "@src/utils"; // this comman modulle for handle mail notifications
import { DatabaseModule, FormModuleRepository, PermissionsRepository } from "@app/common";
import { PermissionsModel } from "@src/permissions/permissions.model";
import { HelperModule } from "@src/helper/helper.module";

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: "FormModule", schema: formModuleModel },
      { name: "Permissions", schema: PermissionsModel },
    ]),
    HelperModule,
    EmailModule,
  ],

  providers: [FormModuleService, MailerCommonService, FormModuleRepository,PermissionsRepository],
  controllers: [FormModuleController],
})
export class FormModuleModule {}
