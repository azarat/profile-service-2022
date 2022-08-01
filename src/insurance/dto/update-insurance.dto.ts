import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

import { Utils } from 'src/utils/utils'

class UpdateInsuranceDTO {
  @ApiProperty({ example: 'AA1111AA' })
  @IsString()
  number: string

  @ApiProperty({ example: '№123123123' })
  @IsString()
  licensePlate: string

  @ApiProperty({ example: 'TAZ' })
  mark: string

  @ApiProperty({ required: true, example: '10.12.2021' })
  @IsOptional()
  @Transform(({ value }) => Utils.transformStringToDate(value))
  date?: Date

  @ApiProperty({
    required: false,
    example: 'file.pdf',
    type: 'string',
    format: 'binary',
  })
  file: string
}

export default UpdateInsuranceDTO
