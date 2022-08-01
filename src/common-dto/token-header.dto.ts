import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

class TokenHeaderDTO {
  @IsString()
  @Expose({ name: 'token' })
  token: string
}

export default TokenHeaderDTO
