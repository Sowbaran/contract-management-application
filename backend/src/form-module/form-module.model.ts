import { AbstractSchema } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  collection: "form_modules",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
})
export class FormModule extends AbstractSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  status?: boolean;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedBy?: string;
}

export const formModuleModel = SchemaFactory.createForClass(FormModule);

formModuleModel.index({code:1, name:1});
formModuleModel.index({name:1, description:1});
formModuleModel.index({name:1});
formModuleModel.index({status:1});
