import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "@app/common/index";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FormModule } from "@src/form-module/form-module.model";

@Injectable()
export class FormModuleRepository extends AbstractRepository<FormModule> {
  protected readonly logger = new Logger(FormModuleRepository.name);
  constructor(
    @InjectModel(FormModule.name)
    formModel: Model<FormModule>,
  ) {
    super(formModel);
  }
}
