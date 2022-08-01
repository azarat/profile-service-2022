import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

import { IsNotEmptyString } from 'src/decorators/is-not-empty-string.decorator'
import { IsPhoneDecorator } from 'src/decorators/is-phone.decorator'

class UserUpdateDTO {
  @ApiProperty({ required: false, example: 'Itachi' })
  @IsString()
  @IsOptional()
  @IsNotEmptyString()
  name?: string

  @ApiProperty({ required: false, example: '+380674613280' })
  @IsPhoneDecorator()
  @IsOptional()
  @IsNotEmptyString()
  phone?: string

  @ApiProperty({ example: 'itachi@anbu.com', required: false })
  @IsOptional()
  email?: string

  @ApiProperty({ required: false, example: 'Konohagakure' })
  @IsString()
  @IsOptional()
  @IsNotEmptyString()
  city?: string

  @ApiProperty({
    required: false,
    example: 'image.png',
    type: 'string',
    format: 'binary',
  })
  photo?: string
}

export default UserUpdateDTO
