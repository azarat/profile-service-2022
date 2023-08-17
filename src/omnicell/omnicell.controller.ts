import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger'

import SendSMSBodyDTO from 'src/omnicell/dto/send-sms.dto'
import { SendStatusEnum } from './enums/send-sms.enum'
import { OmnicellService } from './omnicell.service'
import VerifySMSBodyDTO from './dto/verify-sms.dto'

@Controller('omnicell')
export class OmnicellController {
  constructor(private readonly omnicellService: OmnicellService) {}

  @Post('send-sms')
  @HttpCode(200)
  @ApiTags('Sms services')
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Sms was sent',
  })
  @ApiResponse({
    status: 400,
    description: `Invalid phone or User with this phone doesn't exist`,
  })
  public sendSMS(@Body() { phone, type }: SendSMSBodyDTO): Promise<void> {
    return this.omnicellService.sendSMS(phone, type ? SendStatusEnum[type] ?? SendStatusEnum.LOGIN : SendStatusEnum.LOGIN)
  }
  
  @Post('verify-sms')
  @HttpCode(200)
  @ApiTags('Sms services')
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Sms was sent',
  })
  @ApiResponse({
    status: 400,
    description: `Invalid phone or User with this phone doesn't exist`,
  })
  public verifySMS(@Body() { phone, code }: VerifySMSBodyDTO): Promise<void> {
    return this.omnicellService.omnicellVerify(code, phone)
  }
}
