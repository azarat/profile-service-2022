import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type TokenDocument = Token & Document

@Schema()
export class Token {
  @Prop({ type: String, required: true })
  token: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId
}

export const TokenSchema = SchemaFactory.createForClass(Token)
