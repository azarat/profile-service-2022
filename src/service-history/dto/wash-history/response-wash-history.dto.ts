import { ApiProperty } from '@nestjs/swagger'
import { ServiceHistoryTypeEnum } from 'src/service-history/enums/maintenance.enum'

export class ResponseWashHistoryDTO {
  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  id: string

  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  car: string

  @ApiProperty({ example: 'Happy Wash' })
  name: string

  @ApiProperty({ enum: ServiceHistoryTypeEnum })
  type: ServiceHistoryTypeEnum

  @ApiProperty({ example: 36 })
  mileage: number

  @ApiProperty({ example: 640 })
  price: number

  @ApiProperty({ example: 'I washed car yesterday' })
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
