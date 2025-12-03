import { Module } from "@nestjs/common";
import { DocumentHandlerService } from "./document-handler.service";
import { DocumentHandlerController } from "./document-handler.controller";
import { formDetailsModel } from "../form-details/formDetails.model";
import { EmailModule } from "../email/email.module";
import { MailerCommonService } from "@src/utils";
import { DatabaseModule, FormDetailsRepository } from "@app/common";

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: "FormDetails", schema: formDetailsModel },
    ]),
    EmailModule,
  ],
  providers: [
    DocumentHandlerService,
    MailerCommonService,
    FormDetailsRepository,
  ],
  controllers: [DocumentHandlerController],
  exports: [DocumentHandlerService],
})
export class DocumentHandleModule {}
