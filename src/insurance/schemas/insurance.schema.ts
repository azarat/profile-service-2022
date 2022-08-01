import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type InsuranceDocument = Insurance & Document

@Schema()
export class Insurance {
  @Prop({ type: String, required: true })
  number: string

  @Prop({ type: String, required: true })
  licensePlate: string

  @Prop({ type: String, required: true })
  mark: string

  @Prop({ type: Date })
  date: Date

  @Prop({ type: String, required: true })
  file: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId
}

export const InsuranceSchema = SchemaFactory.createForClass(Insurance)
