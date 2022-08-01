import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class DeviceTokenHeaderDTO {
  @IsNotEmpty()
  @Expose({ name: 'devicetoken' })
  devicetoken: string
}
