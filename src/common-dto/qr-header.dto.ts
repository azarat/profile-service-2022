import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

class QrTokenHeaderDTO {
  @IsString()
  @Expose({ name: 'qrtoken' })
  qrtoken: string
}

export default QrTokenHeaderDTO
