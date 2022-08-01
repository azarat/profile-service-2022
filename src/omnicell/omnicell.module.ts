import { Module, CacheModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { UserModule } from 'src/user/user.module'
import { OmnicellController } from './omnicell.controller'
import OmnicellRepository from './omnicell.repository'
import { OmnicellService } from './omnicell.service'

@Module({
  imports: [CacheModule.register(), UserModule, ConfigModule],
  providers: [OmnicellService, OmnicellRepository],
  controllers: [OmnicellController],
  exports: [OmnicellService],
})
export class OmnicellModule {}
