import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export class LogoutHeaderDTO {
  @IsString()
  @Expose({ name: 'devicetoken' })
  devicetoken: string

  @IsString()
  @Expose({ name: 'token' })
  token: string
}
