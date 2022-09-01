import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'
import { Utils } from 'src/utils/utils'

import { SubRecordHistory } from './submaintenance.dto'

export class UpdateMaintenanceHistoryDTO {
  @ApiProperty({ required: false, example: 'Fix some changes' })
  @IsOptional()
  title: string

  @ApiProperty({ required: false, example: 'CTO №1' })
  @IsOptional()
  serviceStation?: string

  @ApiProperty({ required: false, example: 25 })
  @IsOptional()
  mileage?: number

  @ApiProperty({
    required: false,
    type: () => [SubRecordHistory],
    example: [{ name: 'Engine', price: 7500 }],
  })
  @IsOptional()
  @Transform(({ value }) => value && JSON.parse(value))
  carRepairing?: SubRecordHistory[]

  @ApiProperty({
    required: false,
    type: () => [SubRecordHistory],
    example: [{ name: 'brake pads', price: 920 }],
  })
  @IsOptional()
  @Transform(({ value }) => value && JSON.parse(value))
  sparePart?: SubRecordHistory[]

  @ApiProperty({ required: false, example: 640 })
  @IsOptional()
  price?: number

  @ApiProperty({ required: false, example: 'Fixed engine' })
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
