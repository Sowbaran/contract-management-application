import { AbstractSchema } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({
  collection: "permissions",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
})
export class Permissions extends AbstractSchema {
  @Prop({ type: SchemaTypes.ObjectId, default: Types.ObjectId, required: true })
  moduleId: Types.ObjectId;

  @Prop({ required: true })
  permissionCode: string;

  @Prop({ required: true })
  permissionName: string;

  @Prop({ required: true })
  moduleCode: string;

  @Prop({ required: true })
  moduleName: string;

  @Prop({ default: true })
  moduleStatus: boolean;

  @Prop()
  description: string;

  @Prop({ default: true })
  status: boolean;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedBy?: string; 

  createdAt?: Date;
  updatedAt?: Date;
}

export const PermissionsModel = SchemaFactory.createForClass(Permissions);

PermissionsModel.index({permissionCode:1, permissionName:1});
PermissionsModel.index({status:1, modelStatus:1});
PermissionsModel.index({permissionName:1});
PermissionsModel.index({moduleId:1});
