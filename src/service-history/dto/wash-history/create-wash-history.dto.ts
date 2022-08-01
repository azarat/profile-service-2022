import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { Utils } from 'src/utils/utils'

export class CreateWashHistoryDTO {
  @ApiProperty({ required: true, example: 'Happy Wash' })
  @IsString()
  @MinLength(2)
  name: string

  @ApiProperty({ required: true, example: 36 })
  @IsNotEmpty()
  mileage: number

  @ApiProperty({ required: true, example: 640 })
  @IsNotEmpty()
  price: number

  @ApiProperty({ required: true, example: '10.12.2021' })
  @Transform(({ value }) => Utils.transformStringToDate(value))
  date: Date

  @ApiProperty({ required: false, example: 'I washed car yesterday' })
  @IsString()
  @IsOptional()
  comment?: string

  @ApiProperty({ required: false, default: false, example: true })
  @IsOptional()
  isSaved?: boolean

  @ApiProperty({
    required: false,
    example: ['image1.png', 'image2.png'],
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  photos?: string[]
}
