import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Utils } from 'src/utils/utils'

import { SubRecordHistory } from './submaintenance.dto'

export class CreateMaintenanceHistoryDTO {
  @ApiProperty({ required: true, example: 'Fix some changes' })
  @IsNotEmpty()
  title: string

  @ApiProperty({ required: true, example: 'CTO №1' })
  @IsNotEmpty()
  serviceStation: string

  @ApiProperty({ required: true, example: 25 })
  @IsNotEmpty()
  mileage: number

  @ApiProperty({ required: true, example: 640 })
  @IsNotEmpty()
  price: number

  @ApiProperty({ required: true, example: '10.12.2021' })
  @Transform(({ value }) => Utils.transformStringToDate(value))
  date: Date

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

  @ApiProperty({
    required: false,
    example: ['image1.png', 'image2.png'],
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  photos?: string[]
}
