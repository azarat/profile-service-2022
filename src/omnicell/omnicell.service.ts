import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'

import DatabaseUserRepository from 'src/user/user-db.repository'
import { UserStatusEnum } from 'src/user/enums/status.enum'
import OmnicellRepository from './omnicell.repository'
import { SendStatusEnum } from './enums/send-sms.enum'
import { LocalizeError } from 'src/errors/localize.error'

@Injectable()
export class OmnicellService {
  private static readonly OMNICELL_STATUS = 'Accepted'

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly databaseUserRepository: DatabaseUserRepository,
    private readonly omnicellRepository: OmnicellRepository,
    private readonly configService: ConfigService,
  ) {}

  public async sendSMS(phone: string, type: SendStatusEnum): Promise<void> {
    const user = await this.databaseUserRepository.findByPhone(phone)
    const { LOGIN, REGISTRATION, CHANGE } = SendStatusEnum

    if (
      [REGISTRATION, CHANGE].includes(type) &&
      user?.status === UserStatusEnum.ACTIVE
    )
      throw new LocalizeError(LocalizeError.PHONE_EXISTS, HttpStatus.CONFLICT)
    if (type === LOGIN && !user) {
      throw new LocalizeError(LocalizeError.WRONG_PHONE, HttpStatus.BAD_REQUEST)
    }

    const appleTestPhone = await this.configService.get('appleTestPhone')
    const code =
      phone === appleTestPhone
        ? await this.configService.get('appleTestCode')
        : this.generateOTP()
    const value =
      phone === appleTestPhone
        ? OmnicellService.OMNICELL_STATUS
        : await this.omnicellRepository.sendSMS(code, phone)
    if (value !== OmnicellService.OMNICELL_STATUS)
      throw new LocalizeError(
        LocalizeError.INVALID_PHONE,
        HttpStatus.BAD_REQUEST,
      )

    console.log("set cache", phone, code);
    
    await this.cacheManager.set(phone, code, { ttl: 1800 })
  }

  public async omnicellVerify(code: string, phone: string): Promise<void> {
    console.log("phone", phone);
    console.log("code", code);
    console.log("cache code", (await this.cacheManager.get(phone)));
    
    if ((await this.cacheManager.get(phone)) !== code || !code)
      throw new LocalizeError(
        LocalizeError.INVALID_CODE,
        HttpStatus.UNAUTHORIZED,
      )
    
    console.log("Verify OK");
    
    await this.cacheManager.del(phone)
  }

  private generateOTP(): string {
    return Math.random().toString().substring(2, 8)
  }
}
