import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class CreateDriverLicenseDTO {
  @ApiProperty({ example: 'ААА' })
  @IsString()
  @Length(3, 3)
  series: string

  @ApiProperty({ example: '534888' })
  @IsString()
  @Length(6, 6)
  number: string

  @ApiProperty({ example: '2021-11-25' })
  @IsString()
  date: string
}
