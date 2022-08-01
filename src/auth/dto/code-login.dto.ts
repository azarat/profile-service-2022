import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

import { IsPhoneDecorator } from 'src/decorators/is-phone.decorator'

class PhoneLoginBodyDTO {
  @ApiProperty({ example: '+380674613280' })
  @IsPhoneDecorator()
  phone: string

  @ApiProperty({ example: '347010' })
  @IsString()
  @Length(6, 6)
  code: string
}

export default PhoneLoginBodyDTO
