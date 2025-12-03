import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "@app/common/index";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FormDetails } from "@src/form-details/formDetails.model";

@Injectable()
export class FormDetailsRepository extends AbstractRepository<FormDetails> {
  protected readonly logger = new Logger(FormDetailsRepository.name);
  constructor(
    @InjectModel(FormDetails.name)
    formDetails: Model<FormDetails>,
  ) {
    super(formDetails);
  }
}
