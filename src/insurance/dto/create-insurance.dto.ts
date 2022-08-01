import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { Utils } from 'src/utils/utils'

class CreateInsuranceDTO {
  @ApiProperty({ example: 'AA1111AA' })
  @IsString()
  number: string

  @ApiProperty({ example: '№123123123' })
  @IsString()
  licensePlate: string

  @ApiProperty({ example: 'TAZ' })
  mark: string

  @ApiProperty({ required: true, example: '10.12.2021' })
  @Transform(({ value }) => Utils.transformStringToDate(value))
  date: Date

  @ApiProperty({
    required: false,
    example: 'file.pdf',
    type: 'string',
    format: 'binary',
  })
  file: string
}

export default CreateInsuranceDTO
