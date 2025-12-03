import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, SchemaTypes, Types } from "mongoose";
import { Roles } from "../roles/roles.model";
import { AbstractSchema } from "@app/common";
import { FormModule } from "@src/form-module/form-module.model";

export type WorkflowDocument = Workflow & Document;
@Schema()
export class WorkflowOrder {
  @Prop()
  level: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: () => Roles })
  role: ObjectId;

  @Prop({ default: true })
  limitFlag: boolean;

  @Prop()
  min?: number;

  @Prop()
  max?: number;

  @Prop({ default: true })
  isSpecificDeptApprover?: boolean;

  @Prop({ default: true })
  includeOnRequesterCheck?: boolean;

  @Prop({ default: false })
  deedOfNovation?: boolean;

  @Prop({ default: false })
  byPassWorkflow?: boolean;

  @Prop()
  code: string;

  @Prop()
  name: string;
}

@Schema({
  collection: "workflow",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
})
export class Workflow extends AbstractSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: () => FormModule })
  moduleId: Types.ObjectId;

  @Prop({ required: true, default: 1 })
  version: number;

  @Prop({ default: [] })
  workflowOrder: WorkflowOrder[];

  @Prop({ default: true })
  status: boolean;

  @Prop()
  createdBy: string;

  @Prop()
  updatedBy: string;
}

export const WorkflowSchema = SchemaFactory.createForClass(Workflow);

// Define indexes separately
WorkflowSchema.index({ _id: 1, status: 1 }); // Compound index
WorkflowSchema.index({ moduleId: 1, status: 1 }); // Compound index
WorkflowSchema.index({ version: 1 }); // Compound index

export const WorkflowModel = WorkflowSchema;
export const WorkflowOrderSchema = SchemaFactory.createForClass(WorkflowOrder);
