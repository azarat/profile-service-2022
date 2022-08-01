import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type TechnicalPassportDocument = TechnicalPassport & Document

@Schema()
export class TechnicalPassport {
  @Prop({ type: String, required: true })
  series: string

  @Prop({ type: String, required: true })
  number: string

  @Prop({ type: String, required: true })
  carNumber: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId
}

export const TechnicalPassportSchema =
  SchemaFactory.createForClass(TechnicalPassport)
