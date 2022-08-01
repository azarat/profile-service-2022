import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type DriverLicenseDocument = DriverLicense & Document

@Schema()
export class DriverLicense {
  @Prop({ type: String, required: true })
  series: string

  @Prop({ type: String, required: true })
  number: string

  @Prop({ type: String, required: true })
  date: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId
}

export const DriverLicenseSchema = SchemaFactory.createForClass(DriverLicense)
