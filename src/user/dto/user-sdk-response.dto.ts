import { Types } from 'mongoose'

export class UserSdkRepsonseDTO {
  id: Types.ObjectId
  phone: string
  deviceToken: string[]
}
