import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type INNDocument = INN & Document

@Schema()
export class INN {
  @Prop({ type: String, required: true })
  number: string

  @Prop({ type: String, required: true })
  carNumber: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId
}

export const INNSchema = SchemaFactory.createForClass(INN)
