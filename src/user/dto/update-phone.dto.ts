import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

import { IsPhoneDecorator } from 'src/decorators/is-phone.decorator'

class UpdatePhoneDTO {
  @ApiProperty({ example: '347010' })
  @IsString()
  @Length(6, 6)
  code: string

  @ApiProperty({ example: '+380674613280' })
  @IsPhoneDecorator()
  phone: string
}

export default UpdatePhoneDTO
