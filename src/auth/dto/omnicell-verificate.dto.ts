import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsString, Length } from 'class-validator'

import { IsPhoneDecorator } from 'src/decorators/is-phone.decorator'

class OmnicellVerificateDTO {
  @ApiProperty({ example: '347010' })
  @IsString()
  @Length(6, 6)
  @Expose({ name: 'code' })
  code: string

  @ApiProperty({ example: '+380674613280' })
  @IsPhoneDecorator()
  @Expose({ name: 'phone' })
  phone: string
}

export default OmnicellVerificateDTO
