import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

import { IsCarNumber } from 'src/decorators/is-car-number.decorator'

export class CreateINNDTO {
  @ApiProperty({ example: '361867311' })
  @IsString()
  @Length(10, 10)
  number: string

  @ApiProperty({ example: 'КА5810ВО' })
  @IsString()
  @Length(8, 8)
  @IsCarNumber()
  carNumber: string
}
