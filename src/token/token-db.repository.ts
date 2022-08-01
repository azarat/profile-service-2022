import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { UserDocument } from 'src/user/schemas/user.schema'
import { Token, TokenDocument } from './schemas/token.schema'

@Injectable()
class DatabaseTokenRepository {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
  ) {}

  public async getUserByToken(token: string): Promise<TokenDocument> {
    return this.tokenModel.findOne({ token }).populate('user')
  }

  public async createRecord(user: UserDocument, token: string): Promise<void> {
    await this.tokenModel.create({ user, token })
  }

  public async deleteToken(token: string): Promise<void> {
    await this.tokenModel.deleteOne({ token })
  }

  public async deleteTokenByUser(user: Types.ObjectId): Promise<void> {
    await this.tokenModel.deleteOne({
      user: new Types.ObjectId(user),
    })
  }
}

export default DatabaseTokenRepository
