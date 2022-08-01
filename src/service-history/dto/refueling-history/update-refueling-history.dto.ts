import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, IsString, MinLength } from 'class-validator'
import { Utils } from 'src/utils/utils'

export class UpdateRefuelingHistoryDTO {
  @ApiProperty({ required: false, example: 'WOG' })
  @IsString()
  @IsOptional()
  @MinLength(2)
  gasStation?: string

  @ApiProperty({ required: false, example: 25 })
  @IsOptional()
  mileage?: number

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  isFullTank?: boolean

  @ApiProperty({ required: false, example: 23.5 })
  @IsOptional()
  pricePerLiter?: number

  @ApiProperty({ required: false, example: 22 })
  @IsOptional()
  liters?: number

  @ApiProperty({ required: false, example: 'A92' })
  @IsString()
  @IsOptional()
  fuelType?: string

  @ApiProperty({ required: false, example: 529 })
  @IsOptional()
  price?: number

  @ApiProperty({ required: false, example: 'Filled full tank' })
  @IsString()
  @IsOptional()
  comment?: string

  @ApiProperty({ required: false, default: false, example: true })
  @IsOptional()
  isSaved?: boolean

  @ApiProperty({ required: false, example: '10.12.2021' })
  @IsOptional()
  @Transform(({ value }) => Utils.transformStringToDate(value))
  date?: Date

  @ApiProperty({
    required: false,
    example: ['image1.png', 'image2.png'],
    type: 'array',
    items: { type: 'string' },
  })
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  deletedPhotos?: string[]

  @ApiProperty({
    required: false,
    example: ['image1.png', 'image2.png'],
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  updatedPhotos?: Express.Multer.File[]
}
