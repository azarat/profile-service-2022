import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { ServiceHistoryTypeEnum } from '../enums/maintenance.enum'

export type RefuelingHistoryDocument = RefuelingHistory & Document

@Schema({ collection: 'refueling-histories' })
export class RefuelingHistory {
  @Prop({ type: String, required: true })
  gasStation: string

  @Prop({ type: Date })
  date: Date

  @Prop({ type: Number, required: true })
  mileage: number

  @Prop({ type: Boolean, required: true })
  isFullTank: boolean

  @Prop({ type: Number })
  pricePerLiter: number

  @Prop({ type: Number })
  price: number

  @Prop({ type: Number })
  liters: number

  @Prop({ type: String })
  fuelType: string

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

export const RefuelingHistorySchema =
  SchemaFactory.createForClass(RefuelingHistory)
