import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Roles } from "../roles/roles.model";
import { Departments } from "../departments/departments.model";
import { AbstractSchema } from "@app/common";

@Schema()
export class UserDepartment {
  @Prop({ type: SchemaTypes.ObjectId, ref: () => Departments })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: string;

  @Prop({ type: [Roles], default: [] })
  roles: Roles[];
}

@Schema({
  collection: "users",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
})
export class Users extends AbstractSchema {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({ type: [UserDepartment], default: [] })
  departments: UserDepartment[];

  @Prop({ default: true })
  status: boolean;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedBy?: string;
}

const UsersSchema = SchemaFactory.createForClass(Users);

UsersSchema.index({ email: 1, status: 1 }); // Compound index
UsersSchema.index({ email: 1 });
UsersSchema.index({ status: 1 });


export const UsersModel = UsersSchema;
