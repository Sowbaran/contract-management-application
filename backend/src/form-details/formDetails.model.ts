import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
  Schema as MongooseSchema,
  Types,
  ObjectId,
  SchemaTypes,
} from "mongoose";
import { Roles } from "../roles/roles.model";
import { Departments } from "../departments/departments.model";
import { Workflow } from "../workflow/workflow.model";
import { FormModule } from "../form-module/form-module.model";
import { AbstractSchema } from "@app/common";
import { FormStatus } from "../constants";

@Schema({ _id: false })
export class Signer {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  email: string;
}
export const SignerSchema = SchemaFactory.createForClass(Signer);
export class WorkflowOrder {
  @Prop()
  level: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: () => Roles })
  roleId: ObjectId;

  @Prop({ default: true })
  limitFlag?: boolean;

  @Prop()
  min?: number;

  @Prop()
  max?: number;

  @Prop()
  name?: string;

  @Prop()
  code?: string;

  @Prop()
  status?: string;

  @Prop()
  isHeadOfPnCFinalApprover?: boolean;

  @Prop()
  isSpecificDeptApprover: boolean;

  @Prop()
  includeOnRequesterCheck: boolean;

  @Prop()
  deedOfNovation?: boolean;

  @Prop()
  byPassWorkflow?: boolean;
}
@Schema({
  collection: "form_details",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
})
export class FormDetails extends AbstractSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: () => FormModule })
  moduleId: Types.ObjectId;

  @Prop()
  code: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  formInfo: object;

  @Prop({ type: MongooseSchema.Types.Mixed })
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  attachments: Array<any>;

  @Prop()
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  msaAttachments?: Array<any>;

  @Prop({ type: MongooseSchema.Types.Mixed })
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  formHistory: Array<any>;

  @Prop({ type: SchemaTypes.ObjectId, ref: () => Departments })
  department: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: () => Roles })
  workflow: Types.ObjectId;

  @Prop()
  departmentName: string;

  @Prop()
  workflowName: string;

  @Prop({ type: Types.ObjectId, ref: () => Workflow })
  workflowVersion: Types.ObjectId;

  // @Prop()
  // executiveApprove: boolean; // Used the finance module only for the first level of the approver workflow.

  // @Prop({ default: false })
  // isDynamicApprover: boolean; // Used P&C headcount module for the dynamic approver workflow

  @Prop({ default: FormStatus.PENDING })
  status: string;

  @Prop({ default: true })
  active: boolean;

  @Prop() // Use Types.ObjectId here
  createdBy: string;

  @Prop() // Use Types.ObjectId here
  updatedBy: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  formAdditionalInfo?: object;

  @Prop()
  envelopeId?: string;

  @Prop({ default: [] })
  workflowOrder: WorkflowOrder[];

  @Prop() // Use Types.ObjectId here
  moduleCode: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  envelopeSummary?: object;

  @Prop({ type: MongooseSchema.Types.Mixed })
  specificApproverDetails?: object;

  @Prop()
  docusignStatus?: string;

  @Prop({ type: [SignerSchema], default: [] })
  signers?: Signer[];

  @Prop()
  signingUrl?: string; 

  @Prop({ default: "V2" })
  version?: string;
}

const FormDetailsSchema = SchemaFactory.createForClass(FormDetails);

FormDetailsSchema.index({ code: 1 }); //ok
FormDetailsSchema.index({ moduleId: 1, status: 1 }); //ok
FormDetailsSchema.index({ moduleId: 1, active: 1 }); //ok
FormDetailsSchema.index({ _id: 1, createdBy: 1, moduleId: 1, active: 1 }); //ok
FormDetailsSchema.index({
  "workflowOrder.roleId": 1,
  "workflowOrder.status": 1,
  "workflowOrder.isSpecificDeptApprover": 1,
});

FormDetailsSchema.index({ department: 1 });

FormDetailsSchema.index({ workflow: 1 });

export const formDetailsModel = FormDetailsSchema;
