import { IFuelTypes } from './fuel-types.interface'

export interface IRepositoryMonthlyFuelHistory {
  _id: number
  fuelTypes: IFuelTypes[]
}
