import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "@app/common/index";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Workflow } from "@src/workflow/workflow.model";

@Injectable()
export class WorkflowRepository extends AbstractRepository<Workflow> {
  protected readonly logger = new Logger(WorkflowRepository.name);
  constructor(
    @InjectModel(Workflow.name)
    workflowModel: Model<Workflow>,
  ) {
    super(workflowModel);
  }
}
