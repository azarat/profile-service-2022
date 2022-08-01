import { ApiProperty } from '@nestjs/swagger'

export class GeneralStatisticResponseDTO {
  @ApiProperty()
  fuelType?: string

  @ApiProperty()
  price: number

  @ApiProperty()
  pricePerKm: number

  @ApiProperty()
  fuelConsumption: number

  @ApiProperty()
  favoriteFuelType?: string

  @ApiProperty()
  mileage: number
}
