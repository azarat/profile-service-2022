import { UserStatusEnum } from '../enums/status.enum'

export interface IUserCreate {
  status: UserStatusEnum
  email?: string
  phone: string
  name: string
}
