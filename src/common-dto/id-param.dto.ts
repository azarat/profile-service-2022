import { Expose } from 'class-transformer'

import { IsId } from 'src/decorators/is-id.decorator'

export class IdParamDTO {
  @IsId()
  @Expose({ name: 'id' })
  id: string
}
