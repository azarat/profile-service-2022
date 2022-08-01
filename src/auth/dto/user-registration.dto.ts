import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

import { IsPhoneDecorator } from 'src/decorators/is-phone.decorator'

class UserRegistrationDTO {
  @ApiProperty({ example: 'Itachi' })
  @IsString()
  @MinLength(2)
  name: string

  @ApiProperty({ example: '+380674613280' })
  @IsPhoneDecorator()
  phone: string

  @ApiProperty({ example: 'itachi@anbu.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string
}

export default UserRegistrationDTO
