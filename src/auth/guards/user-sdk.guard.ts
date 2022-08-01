import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserSdkGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const { secret } = req.headers
    if (secret !== (await this.configService.get('sdkSecret')))
      throw new HttpException('Wrong secret', HttpStatus.UNAUTHORIZED)
    return true
  }
}
