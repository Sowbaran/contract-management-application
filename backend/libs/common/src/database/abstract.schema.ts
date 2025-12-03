import { SchemaTypes, Types } from "mongoose";
import { Schema, Prop } from "@nestjs/mongoose";

@Schema()
export abstract class AbstractSchema {
  @Prop({ type: SchemaTypes.ObjectId, default: Types.ObjectId })
  _id: Types.ObjectId;
}
