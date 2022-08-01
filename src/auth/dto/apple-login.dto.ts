import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AppleLoginDTO {
  @ApiProperty({ required: true })
  @IsString()
  idToken: string

  @ApiProperty({ required: true })
  @IsString()
  nonce: string
}
