import { Module } from '@nestjs/common'

import { OmnicellModule } from 'src/omnicell/omnicell.module'
import TokenModule from 'src/token/token.module'
import { UserModule } from 'src/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [UserModule, OmnicellModule, TokenModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
