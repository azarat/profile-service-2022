import { ApiProperty } from '@nestjs/swagger'

import { ServiceHistoryTypeEnum } from '../enums/maintenance.enum'

export class AllRecordsResponseDTO {
  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  id: string

  @ApiProperty({ example: 'Title' })
  title: string

  @ApiProperty({ example: 524 })
  price: number

  @ApiProperty({ example: 102323 })
  mileage: number

  @ApiProperty({ example: '2021-03-30' })
  date: Date

  @ApiProperty({ example: ServiceHistoryTypeEnum.REFUELING })
  type: ServiceHistoryTypeEnum
}
