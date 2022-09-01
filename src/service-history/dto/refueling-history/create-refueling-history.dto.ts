import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { Utils } from 'src/utils/utils'

export class CreateRefuelingHistoryDTO {
  @ApiProperty({ required: true, example: 'WOG' })
  @IsString()
  @MinLength(2)
  gasStation: string

  @ApiProperty({ required: true, example: 25 })
  @IsNotEmpty()
  mileage: number

  @ApiProperty({ required: true, example: true })
  @IsNotEmpty()
  isFullTank: boolean

  @ApiProperty({ required: true, example: 22 })
  liters: number

  @ApiProperty({ required: true, example: 529 })
  @IsNotEmpty()
  price: number

  @ApiProperty({ required: true, example: '10.12.2021' })
  @Transform(({ value }) => Utils.transformStringToDate(value))
  date: Date

  @ApiProperty({ required: false, example: 23.5 })
  @IsOptional()
  pricePerLiter?: number

  @ApiProperty({ required: false, example: 'Filled full tank' })
  @IsString()
  @IsOptional()
  comment?: string

  @ApiProperty({ required: false, example: 'A92' })
  @IsString()
  @IsOptional()
  fuelType?: string

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
