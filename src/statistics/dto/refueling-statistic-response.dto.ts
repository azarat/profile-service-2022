import { ApiProperty } from '@nestjs/swagger'

import { GeneralStatisticResponseDTO } from './general-statistic-response.dto'

export class RefuelingStatisticResponseDTO {
  @ApiProperty({ type: () => [GeneralStatisticResponseDTO] })
  statistic: GeneralStatisticResponseDTO[]

  @ApiProperty()
  favorite: string[]
}
