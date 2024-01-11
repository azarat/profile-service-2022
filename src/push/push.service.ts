import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import axios from 'axios';
import DatabaseUserRepository from 'src/user/user-db.repository'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PushService {
  constructor(
    private readonly databaseUserRepository: DatabaseUserRepository,
    private configService: ConfigService,
  ) {}

  public async pushUserByPhone(phone: string, title: string, body: string, type: string): Promise<void> {
    const user = await this.databaseUserRepository.findByPhone(phone)

    if (user == null) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    const { deviceToken } = user
    
    if (deviceToken == null || !deviceToken.length) {
        throw new HttpException('User has no device', HttpStatus.NOT_FOUND);
    }

    let pushType = type ?? "VINTRACKER_STATUS_CHANGED"
    
    await axios.post(
        this.configService.get('pushNotificationsUri'),
        {
          tokens: deviceToken,
          notification: {
            title,
            body,
          },
          data: {
            type: pushType
          },
        },
        {
          headers: {
            token: this.configService.get('pushLambdaSecret'),
          },
        },
    )
  }
}