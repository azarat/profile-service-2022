import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, IsString, MinLength } from 'class-validator'
import { Utils } from 'src/utils/utils'

export class UpdateWashHistoryDTO {
  @ApiProperty({ required: false, example: 'Happy Wash' })
  @IsString()
  @IsOptional()
  @MinLength(2)
  name?: string

  @ApiProperty({ required: false, example: 36 })
  @IsOptional()
  mileage?: number

  @ApiProperty({ required: false, example: 640 })
  @IsOptional()
  price?: number

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

  @ApiProperty({ required: false, example: '10.12.2021' })
  @Transform(({ value }) => Utils.transformStringToDate(value))
  @IsOptional()
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
