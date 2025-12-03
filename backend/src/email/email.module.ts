import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { SecretService } from "../secret/secret.service";
import { SecretModule } from "../secret/secret.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule, SecretModule],
  providers: [EmailService, SecretService],
  exports: [EmailService],
})
export class EmailModule {}
