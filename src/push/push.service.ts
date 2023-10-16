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

  public async pushUserByPhone(phone: string, title: string, body: string): Promise<void> {
    const user = await this.databaseUserRepository.findByPhone(phone)

    if (user == null) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    const { deviceToken } = user
    
    if (deviceToken == null || !deviceToken.length) {
        throw new HttpException('User has no device', HttpStatus.NOT_FOUND);
    }
    
    await axios.post(
        this.configService.get('pushNotificationsUri'),
        {
          tokens: deviceToken,
          notification: {
            title,
            body,
          },
          data: {
            type: "VINTRACKER_STATUS_CHANGED"
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