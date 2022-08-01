import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

import OmnicellResponseDto from './dto/omnicell-response.dto'

@Injectable()
class OmnicellRepository {
  constructor(private configService: ConfigService) {}

  public async sendSMS(code: string, phone: string): Promise<string> {
    const body = {
      body: { value: `Ваш код: ${code}\n\n\nQTT1jK1+QmG` },
      desc: 'Simple bulk via json',
      extended: true,
      id: 'single',
      source: 'daydrive',
      to: [{ msisdn: phone }],
      type: 'SMS',
      validity: '+30 min',
    }
    const {
      data: {
        state: { value },
      },
    } = await axios.post<OmnicellResponseDto>(
      this.configService.get('omnicellUrl'),
      body,
      {
        headers: {
          Authorization: `Basic ${this.configService.get('omnicellAuthToken')}`,
        },
      },
    )
    return value
  }
}

export default OmnicellRepository
