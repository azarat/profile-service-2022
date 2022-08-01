import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import { Token, TokenSchema } from './schemas/token.schema'
import DatabaseTokenRepository from './token-db.repository'
import TokenService from './token.service'

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    ConfigModule,
  ],
  providers: [TokenService, DatabaseTokenRepository],
  exports: [TokenService, DatabaseTokenRepository],
})
class TokenModule {}

export default TokenModule
