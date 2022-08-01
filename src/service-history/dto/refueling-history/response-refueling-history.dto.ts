import { ApiProperty } from '@nestjs/swagger'
import { ServiceHistoryTypeEnum } from 'src/service-history/enums/maintenance.enum'

export class ResponseRefuelingHistoryDTO {
  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  id: string

  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  car: string

  @ApiProperty({ example: 'WOG' })
  gasStation: string

  @ApiProperty({ enum: ServiceHistoryTypeEnum })
  type: ServiceHistoryTypeEnum

  @ApiProperty({ example: 25 })
  mileage: number

  @ApiProperty({ example: true })
  isFullTank: boolean

  @ApiProperty({ example: 23.5 })
  pricePerLiter: number

  @ApiProperty({ example: 529 })
  price: number

  @ApiProperty({ example: 22 })
  liters: number

  @ApiProperty({ example: 'A92' })
  fuelType?: string

  @ApiProperty({ example: 'Filled full tank' })
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
