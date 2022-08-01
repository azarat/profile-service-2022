import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, Length } from 'class-validator'

import { IsCarNumber } from 'src/decorators/is-car-number.decorator'

export class UpdateINNDTO {
  @ApiProperty({ required: false, example: '361867311' })
  @IsString()
  @Length(10, 10)
  @IsOptional()
  number?: string

  @ApiProperty({ required: false, example: 'КА5810ВО' })
  @IsString()
  @Length(8, 8)
  @IsCarNumber()
  @IsOptional()
  carNumber?: string
}
