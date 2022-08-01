import { ApiProperty } from '@nestjs/swagger'

import { IsPhoneDecorator } from 'src/decorators/is-phone.decorator'

class SendSMSBodyDTO {
  @ApiProperty({ example: '+380674613280' })
  @IsPhoneDecorator()
  phone: string
}

export default SendSMSBodyDTO
