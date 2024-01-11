import { ApiProperty } from '@nestjs/swagger'

export class CarResponseDTO {
  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  id: string

  @ApiProperty({ example: 1985 })
  year: number

  @ApiProperty({ example: 'Toyota' })
  mark: string

  @ApiProperty({ example: 'Supra' })
  model: string

  @ApiProperty({ example: 'Supra (A7)' })
  modelType: string

  @ApiProperty({ example: 'Supra (A7)' })
  generation: string

  @ApiProperty({ example: 'Toyota Supra (A7) 3.0 Turbo (MA70)' })
  modification: string

  @ApiProperty({ example: 'Седан' })
  bodyType: string

  @ApiProperty({ example: 87234 })
  mileage: number

  @ApiProperty({ example: '4Y1SL65848Z411439' })
  vin: string

  @ApiProperty({ example: 'КА2323АО' })
  licensePlate: string

  @ApiProperty({ example: 'y2015' })
  plateFormat: string
}
