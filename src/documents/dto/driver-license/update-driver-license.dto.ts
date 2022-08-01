import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, Length } from 'class-validator'

export class UpdateDriverLicenseDTO {
  @ApiProperty({ required: false, example: 'ААА' })
  @IsString()
  @Length(3, 3)
  @IsOptional()
  series?: string

  @ApiProperty({ required: false, example: '534888' })
  @IsString()
  @Length(6, 6)
  @IsOptional()
  number?: string

  @ApiProperty({ required: false, example: '2021-11-25' })
  @IsString()
  @IsOptional()
  date?: string
}
