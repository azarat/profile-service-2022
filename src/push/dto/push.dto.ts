import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { IsPhoneDecorator } from 'src/decorators/is-phone.decorator'

class PushByUserPhoneDTO {
  @ApiProperty({ example: '+380674613280' })
  @IsPhoneDecorator()
  phone: string

  @IsString()
  body: string
  
  @IsString()
  title: string

  @IsString()
  @IsOptional()
  type: string
}

export default PushByUserPhoneDTO
