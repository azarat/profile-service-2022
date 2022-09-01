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

  @ApiProperty({ required: true, example: '2021-12-10 12:24:36' })
  @Transform(({ value }) => Utils.transformStringToDate(value))
  date: Date

  @ApiProperty({ required: false, example: 'I washed car yesterday' })
  @IsString()
  @IsOptional()
  comment?: string

  @ApiProperty({ required: false, default: false, example: true })
  @IsOptional()
  isSaved?: boolean

  @ApiProperty({ required: false, default: false, example: true })
  @IsOptional()
  @Transform(({ value }) => value == "true" ? true : false)
  updCarMileage?: boolean

  @ApiProperty({
    required: false,
    example: ['image1.png', 'image2.png'],
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  photos?: string[]
}
