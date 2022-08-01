import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'
import { IsId } from 'src/decorators/is-id.decorator'
import { IsPhoneDecorator } from 'src/decorators/is-phone.decorator'

class UserDTO {
  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  @IsString()
  @IsId()
  id: string

  @ApiProperty({ example: 'Itachi' })
  @IsString()
  name: string

  @ApiProperty({ example: '+380674613280' })
  @IsPhoneDecorator()
  phone: string

  @ApiProperty({ example: 'itachi@anbu.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({ example: 'Konohagakure', required: false })
  @IsString()
  @IsOptional()
  city?: string

  @ApiProperty({ example: 'image.png', required: false })
  @IsString()
  @IsOptional()
  photo?: string
}

export default UserDTO
