import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Roles } from "../roles/roles.model";
import { FormModule } from "../form-module/form-module.model";
import { AbstractSchema } from "@app/common";

@Schema({
  collection: "departments",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
})
export class Departments extends AbstractSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop()
  description?: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: () => FormModule }] })
  moduleId?: Types.ObjectId[];

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: () => Roles }],
    required: false,
  })
  roles?: Types.ObjectId[];

  @Prop({ default: true })
  status: boolean;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedBy?: string;
}
const DepartmentsSchema = SchemaFactory.createForClass(Departments);

// Define indexes separately
DepartmentsSchema.index({ code: 1, name: 1 }); // Compound index
DepartmentsSchema.index({ name: 1 });
DepartmentsSchema.index({ status: 1 });
DepartmentsSchema.index({ status: 1, moduleId:1});

export const DepartmentsModel = DepartmentsSchema;
