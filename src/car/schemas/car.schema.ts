import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

import { LICINSE_PLATES } from '../constants/licensePlates'

export type CarDocument = Car & Document

@Schema()
export class Car {
  @Prop({ type: Number, required: true })
  year: number

  @Prop({ type: String, required: true })
  mark: string

  @Prop({ type: String, required: true })
  model: string

  @Prop({ type: String })
  modelType: string

  @Prop({ type: String })
  generation: string

  @Prop({ type: String })
  modification: string

  @Prop({ type: String })
  bodyType: string

  @Prop({ type: Number, required: true })
  mileage: number

  @Prop({ type: String })
  vin: string

  @Prop({ type: String })
  licensePlate: string

  @Prop({ type: String })
  plateFormat: keyof typeof LICINSE_PLATES

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId
}

export const CarSchema = SchemaFactory.createForClass(Car)
