import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

import { IsPhoneDecorator } from 'src/decorators/is-phone.decorator'

class SendSMSBodyDTO {
  @ApiProperty({ example: '+380674613280' })
  @IsPhoneDecorator()
  phone: string

  @ApiProperty({ example: 'LOGIN' })
  @IsOptional()
  type?: string
}

export default SendSMSBodyDTO
