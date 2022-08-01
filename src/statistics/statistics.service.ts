import { Injectable } from '@nestjs/common'

import { DatabaseServiceHistoryRepository } from 'src/service-history/service-history-db.repository'
import { TypeEnum } from './enums/type.enum'
import { IHistoryDocuments } from './interfaces/history-documents.interface'
import { StatisticTwoResponseDTO } from './dto/statistic-two-response.dto'
import { WashHistoryDocument } from 'src/service-history/schemas/wash-history.schema'
import { MaintenanceHistoryDocument } from 'src/service-history/schemas/maintenance-history.schema'
import { GeneralStatisticResponseDTO } from './dto/general-statistic-response.dto'
import { RefuelingHistoryDocument } from 'src/service-history/schemas/refueling-history.schema'
import { IFuelConsumption } from './interfaces/fuel-consumption.interface'
import { RefuelingStatisticResponseDTO } from './dto/refueling-statistic-response.dto'
import { HistoryDocuments } from './interfaces/history-documents.type'

@Injectable()
export class StatisticsService {
  constructor(
    private readonly databaseServiceHistoryRepository: DatabaseServiceHistoryRepository,
  ) {}

  public async getGeneralStatistic(
    carId: string,
    type: TypeEnum,
  ): Promise<GeneralStatisticResponseDTO> {
    const {
      refuelingHistoryRecords,
      washHistoryRecords,
      maintenanceHistoryRecords,
    } = await this.getAllRecords(carId)

    const filteredRefueling = this.filterStatistics(
      refuelingHistoryRecords,
      type,
    ) as RefuelingHistoryDocument[]
    const filteredWash = this.filterStatistics(washHistoryRecords, type)
    const filteredMaintenance = this.filterStatistics(
      maintenanceHistoryRecords,
      type,
    )

    const price =
      this.countSum(filteredRefueling) +
      this.countSum(filteredWash) +
      this.countSum(filteredMaintenance)
    const allRecords = [
      ...filteredRefueling,
      ...filteredWash,
      ...filteredMaintenance,
    ].sort((a, b) => a.date.getTime() - b.date.getTime())
    const mileage =
      allRecords[allRecords.length - 1]?.mileage - allRecords[0]?.mileage

    const fuelTypes = refuelingHistoryRecords.length
      ? refuelingHistoryRecords.reduce(
          (acc, { fuelType }) => ({
            ...acc,
            [fuelType]: (acc[fuelType] || 0) + 1,
          }),
          {},
        )
      : undefined

    const favoriteFuelType =
      fuelTypes &&
      Object.entries(fuelTypes).find(
        ([, val]) => val === Math.max.apply(null, Object.values(fuelTypes)),
      )
    const pricePerKm = price / mileage

    return {
      price,
      fuelConsumption: filteredRefueling
        ? this.countAvgFuelConsumption(
            filteredRefueling
              .filter(({ fuelType }) => fuelType === favoriteFuelType[0])
              .reverse(),
          )
        : null,
      favoriteFuelType: favoriteFuelType ? favoriteFuelType[0] : null,
      mileage: Number.isNaN(mileage) ? null : mileage,
      pricePerKm: Number.isNaN(pricePerKm) ? null : pricePerKm,
    }
  }

  public async getRefuelingStatistic(
    carId: string,
    type: TypeEnum,
  ): Promise<RefuelingStatisticResponseDTO> {
    const refuelingHistoryRecords =
      await this.databaseServiceHistoryRepository.getAllRefuelingHistory(carId)
    const filteredRefueling = this.filterStatistics(
      refuelingHistoryRecords,
      type,
    ) as RefuelingHistoryDocument[]

    const fuelTypes = [
      ...new Set(
        refuelingHistoryRecords.reduce((acc, { fuelType }) => {
          if (fuelType) {
            acc.push(fuelType)
          }
          return acc
        }, []),
      ),
    ]

    const favorite = (filteredRefueling as RefuelingHistoryDocument[]).reduce(
      (acc: string[], { isSaved, gasStation }) => {
        if (isSaved) {
          acc.push(gasStation)
        }
        return acc
      },
      [],
    )

    const statistic = fuelTypes.map((fuelType) => {
      const filteredByFuel = filteredRefueling
        .filter((item) => item.fuelType === fuelType)
        .reverse()
      const price = this.countSum(filteredByFuel)
      const mileageSubtraction = filteredByFuel.reduce(
        (acc: number[], item, index, self) => {
          if (index < self.length - 1) {
            acc.push(self[index + 1].mileage - item.mileage)
          }
          return acc
        },
        [],
      )

      return {
        fuelType,
        price,
        pricePerKm:
          price /
          (filteredByFuel[filteredByFuel.length - 1].mileage -
            filteredByFuel[0].mileage),
        fuelConsumption: this.countAvgFuelConsumption(filteredByFuel),
        mileage: this.countAvgArrayValue(mileageSubtraction),
      }
    })

    return { statistic, favorite }
  }

  public async getCarWashStatistic(
    carId: string,
    type: TypeEnum,
  ): Promise<StatisticTwoResponseDTO> {
    const washHistoryRecords =
      await this.databaseServiceHistoryRepository.getAllWashHistory(carId)
    const filteredWash = this.filterStatistics(washHistoryRecords, type)
    const favorite = (filteredWash as WashHistoryDocument[]).reduce(
      (acc, { isSaved, name }) => {
        if (isSaved) {
          acc.push(name)
        }
        return acc
      },
      [],
    )

    return {
      price: this.countSum(filteredWash),
      favorite,
    }
  }

  public async getMaintenanceStatistic(
    carId: string,
    type: TypeEnum,
  ): Promise<StatisticTwoResponseDTO> {
    const maintenanceHistoryRecords =
      await this.databaseServiceHistoryRepository.getAllMaintenanceHistory(
        carId,
      )
    const filteredMaintenance = this.filterStatistics(
      maintenanceHistoryRecords,
      type,
    )

    const favorite = (
      filteredMaintenance as MaintenanceHistoryDocument[]
    ).reduce((acc, { isSaved, serviceStation }) => {
      if (isSaved) {
        acc.push(serviceStation)
      }
      return acc
    }, [])

    return {
      price: this.countSum(filteredMaintenance),
      favorite,
    }
  }

  private async getAllRecords(carId: string): Promise<IHistoryDocuments> {
    return {
      refuelingHistoryRecords:
        await this.databaseServiceHistoryRepository.getAllRefuelingHistory(
          carId,
        ),
      washHistoryRecords:
        await this.databaseServiceHistoryRepository.getAllWashHistory(carId),
      maintenanceHistoryRecords:
        await this.databaseServiceHistoryRepository.getAllMaintenanceHistory(
          carId,
        ),
    }
  }

  private countSum(records): number {
    return records.reduce((acc: number, item) => {
      const { price } = item
      if (typeof price === 'undefined') {
        return item
      }
      return acc + price
    }, 0)
  }

  private filterStatistics(
    records: HistoryDocuments,
    type: TypeEnum,
  ): HistoryDocuments {
    if (type === TypeEnum.ALL) return records
    return records.filter(
      ({ date }) => date.getMonth() === new Date().getMonth(),
    )
  }

  private countAvgArrayValue(arr: number[]): number {
    return arr.reduce((acc, item) => acc + item, 0) / arr.length
  }

  private countAvgFuelConsumption(records: RefuelingHistoryDocument[]): number {
    const fuelConsumption = records.reduce(
      (acc: IFuelConsumption[], currentElement, index, self) => {
        if (index < self.length - 1) {
          const nextElement = self[index + 1]
          if (currentElement.isFullTank === nextElement.isFullTank) {
            const mileage = nextElement.mileage - currentElement.mileage
            const liters = currentElement.isFullTank
              ? nextElement.liters
              : currentElement.liters
            acc.push({ mileage, liters })
          }
        }
        return acc
      },
      [],
    )
    const kmsPerLiters = fuelConsumption.map(
      ({ mileage, liters }) => (liters / mileage) * 100,
    )
    return this.countAvgArrayValue(kmsPerLiters)
  }
}
