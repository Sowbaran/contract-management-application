import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, SchemaTypes } from "mongoose";
import { FormModule } from "../form-module/form-module.model";
import { AbstractSchema } from "@app/common";
import {
  Permissions,
  PermissionsModel,
} from "../permissions/permissions.model";

@Schema({
  collection: "roles",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
})
export class Roles extends AbstractSchema {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop()
  description?: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: () => FormModule }] })
  moduleId: Types.ObjectId[];

  @Prop({ default: true })
  status: boolean;

  @Prop({ type: [PermissionsModel], default: [] })
  permissions: Permissions[];

  @Prop()
  createdBy?: string;

  @Prop()
  updatedBy?: string;
}

const RolesSchema = SchemaFactory.createForClass(Roles);

RolesSchema.index({ code: 1 }); 
RolesSchema.index({ code: 1, name: 1 }); 
RolesSchema.index({ name: 1, description: 1 }); 
RolesSchema.index({ name: 1 }); 
RolesSchema.index({ moduleId: 1, status: 1 }); 
RolesSchema.index({ status: 1 }); 

export const RolesModel = RolesSchema;
