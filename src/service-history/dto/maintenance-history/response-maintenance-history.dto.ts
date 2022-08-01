import { ApiProperty } from '@nestjs/swagger'
import { ServiceHistoryTypeEnum } from 'src/service-history/enums/maintenance.enum'

import { SubRecordHistory } from './submaintenance.dto'

export class ResponseMaintenanceHistoryDTO {
  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  id: string

  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  car: string

  @ApiProperty({ example: 'Fix some changes' })
  title: string

  @ApiProperty({ enum: ServiceHistoryTypeEnum })
  type: ServiceHistoryTypeEnum

  @ApiProperty({ example: 'CTO №1' })
  serviceStation: string

  @ApiProperty({ example: 25 })
  mileage: number

  @ApiProperty({ example: [{ name: 'Engine', price: 7500 }] })
  carRepairing: SubRecordHistory[]

  @ApiProperty({ example: [{ name: 'brake pads', price: 920 }] })
  sparePart: SubRecordHistory[]

  @ApiProperty({ example: 640 })
  price: number

  @ApiProperty({ example: 'Fixed engine' })
  comment: string

  @ApiProperty({ example: true })
  isSaved: boolean

  @ApiProperty({
    example: ['image1.png', 'image2.png'],
    type: 'array',
  })
  photos: string[]

  @ApiProperty({ example: '2021-11-03T15:30:05.784Z' })
  date: Date
}
