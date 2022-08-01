import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

import { IsCarNumber } from 'src/decorators/is-car-number.decorator'

export class CreateTechnicalPassportDTO {
  @ApiProperty({ example: 'ААА' })
  @IsString()
  @Length(3, 3)
  series: string

  @ApiProperty({ example: '108429' })
  @IsString()
  @Length(6, 6)
  number: string

  @ApiProperty({ example: 'КА5810ВО', required: true })
  @IsString()
  @Length(8, 8)
  @IsCarNumber()
  carNumber: string
}
