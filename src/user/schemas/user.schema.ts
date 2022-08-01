import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({ type: String, required: true, unique: false })
  name: string

  @Prop({ type: String, unique: true, required: true })
  phone: string

  @Prop({ type: String, unique: false })
  email: string

  @Prop({ type: String })
  city: string

  @Prop({ type: String })
  photo: string

  @Prop({ type: String, required: true })
  status: string

  @Prop({ type: [String], required: true })
  deviceToken: string[]
}

export const UserSchema = SchemaFactory.createForClass(User)
