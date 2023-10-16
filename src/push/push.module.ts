import { Module } from '@nestjs/common'
import { PushController } from './push.controller';
import { PushService } from './push.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule
  ],
  providers: [PushService],
  controllers: [PushController],
  exports: [PushService],
})
export class PushModule {}
