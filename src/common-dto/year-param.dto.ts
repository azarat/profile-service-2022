import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

import { IsOptional } from 'class-validator'

export class YearParamDTO {
  @ApiProperty({ example: '2022', required: false })
  @IsOptional()
  @Expose({ name: 'year' })
  @Transform(({ value }) => +value)
  year?: number
}
