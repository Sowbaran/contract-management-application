import { Module } from "@nestjs/common";
import * as dotenv from "dotenv";
import { EmailModule } from "./email/email.module";
import { MailerCommonService } from "@src/utils";
import { SecretModule } from "./secret/secret.module";
import {
  AuthModule,
  AuthService,
  DatabaseModule,
  AuthGuard,
} from "@app/common";
import { APP_GUARD } from "@nestjs/core";
import { DepartmentsModule } from "./departments/departments.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { FormDetailsModule } from "./form-details/form-details.module";
import { FormApprovalModule } from "./form-approval/form-approval.module";
import { RolesModule } from "./roles/roles.module";
import { DocumentHandleModule } from "./document-handler/document-handler.module";
import { UsersModule } from "./users/users.module";
import { FormModuleModule } from "./form-module/form-module.module";
import { WorkflowModule } from "./workflow/workflow.module";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { IncomingMessage } from "http";
import { uuidv7 } from "uuidv7";
import { HelperModule } from "./helper/helper.module";
import { HealthModule } from "./health/health.module";
dotenv.config();

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        base: null,
        quietReqLogger: true,
        genReqId: (req: IncomingMessage) => {
          return uuidv7();
        },
        level: "info",
      },
    }),
    FormDetailsModule,
    FormModuleModule,
    FormApprovalModule,
    DepartmentsModule,
    PermissionsModule,
    RolesModule,
    DocumentHandleModule,
    UsersModule,
    WorkflowModule,
    EmailModule,
    SecretModule,
    AuthModule,
    HealthModule,
  ],
  providers: [
    MailerCommonService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
