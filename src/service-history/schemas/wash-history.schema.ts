import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { ServiceHistoryTypeEnum } from '../enums/maintenance.enum'

export type WashHistoryDocument = WashHistory & Document

@Schema({ collection: 'wash-histories' })
export class WashHistory {
  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: Date })
  date: Date

  @Prop({ type: Number })
  mileage: number

  @Prop({ type: Number })
  price: number

  @Prop({ type: String })
  comment: string

  @Prop({ type: Boolean, default: false })
  isSaved: boolean

  @Prop({ type: [String] })
  photos: string[]

  @Prop({
    type: String,
    required: true,
    enum: Object.values(ServiceHistoryTypeEnum),
  })
  type: ServiceHistoryTypeEnum

  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  car: Types.ObjectId
}

export const WashHistorySchema = SchemaFactory.createForClass(WashHistory)
