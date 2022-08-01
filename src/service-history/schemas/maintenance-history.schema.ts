import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

import { ServiceHistoryTypeEnum } from '../enums/maintenance.enum'

export type MaintenanceHistoryDocument = MaintenanceHistory & Document

class SubRecordHistory {
  @Prop({ type: String })
  name: string

  @Prop({ type: Number })
  price: number
}

@Schema({ collection: 'maintenance-histories' })
export class MaintenanceHistory {
  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: String, required: true })
  serviceStation: string

  @Prop({ type: Date })
  date: Date

  @Prop({ type: Number, required: true })
  mileage: number

  @Prop({ type: () => [SubRecordHistory] })
  carRepairing: SubRecordHistory[]

  @Prop({ type: () => [SubRecordHistory] })
  sparePart: SubRecordHistory[]

  @Prop({ type: Number })
  price: number

  @Prop({ type: [String] })
  photos: string[]

  @Prop({ type: String })
  comment: string

  @Prop({ type: Boolean, default: false })
  isSaved: boolean

  @Prop({
    type: String,
    required: true,
    enum: Object.values(ServiceHistoryTypeEnum),
  })
  type: ServiceHistoryTypeEnum

  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  car: Types.ObjectId
}

export const MaintenanceHistorySchema =
  SchemaFactory.createForClass(MaintenanceHistory)
