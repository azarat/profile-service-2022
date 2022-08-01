import { Expose } from 'class-transformer'

import { IsId } from 'src/decorators/is-id.decorator'

export class CarParamDTO {
  @IsId()
  @Expose({ name: 'carId' })
  carId: string
}
