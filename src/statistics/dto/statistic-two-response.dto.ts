import { ApiProperty } from '@nestjs/swagger'

export class StatisticTwoResponseDTO {
  @ApiProperty()
  price: number

  @ApiProperty()
  favorite: string[]
}
