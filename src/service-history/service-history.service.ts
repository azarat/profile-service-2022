import { Injectable } from '@nestjs/common'

import { AwsS3Service } from 'src/aws/aws-s3.service'
import { DatabaseCarRepository } from 'src/car/car-db.repository'
import { CreateMaintenanceHistoryDTO } from './dto/maintenance-history/create-maintenance-history.dto'
import { ResponseMaintenanceHistoryDTO } from './dto/maintenance-history/response-maintenance-history.dto'
import { UpdateMaintenanceHistoryDTO } from './dto/maintenance-history/update-maintenance-history.dto'
import { CreateRefuelingHistoryDTO } from './dto/refueling-history/create-refueling-history.dto'
import { ResponseRefuelingHistoryDTO } from './dto/refueling-history/response-refueling-history.dto'
import { UpdateRefuelingHistoryDTO } from './dto/refueling-history/update-refueling-history.dto'
import { AllRecordsResponseDTO } from './dto/service-history.response'
import { ResponseMonthlyHistoryDTO } from './dto/response-monthly-history.dto'
import { CreateWashHistoryDTO } from './dto/wash-history/create-wash-history.dto'
import { ResponseMonthlyRefuelingHistoryDTO } from './dto/refueling-history/response-monthly-refueling-history.dto'
import { ResponseWashHistoryDTO } from './dto/wash-history/response-wash-history.dto'
import { IRepositoryMonthlyHistory } from './interfaces/repository-monthly-history.interface'
import { IRepositoryMonthlyFuelHistory } from './interfaces/repository-monthly-fuel-history.interface'
import { UpdateWashHistoryDTO } from './dto/wash-history/update-wash-history.dto'
import { ServiceHistoryTypeEnum } from './enums/maintenance.enum'
import { MaintenanceHistoryDocument } from './schemas/maintenance-history.schema'
import { RefuelingHistoryDocument } from './schemas/refueling-history.schema'
import { WashHistoryDocument } from './schemas/wash-history.schema'
import { DatabaseServiceHistoryRepository } from './service-history-db.repository'
import TokenService from 'src/token/token.service'

@Injectable()
export class ServiceHistoryService {
  constructor(
    private readonly databaseServiceHistoryRepository: DatabaseServiceHistoryRepository,
    private readonly databaseCarRepository: DatabaseCarRepository,
    private readonly awsS3Service: AwsS3Service,
    private readonly tokenService: TokenService,
  ) {}

  public async getMonthlyWashHistory(
    carId: string,
    year: number,
  ): Promise<ResponseMonthlyHistoryDTO> {
    if (!year) year = new Date().getFullYear()
    const records =
      await this.databaseServiceHistoryRepository.getMonthlyWashHistory(
        carId,
        year,
      )
    return this.transformMonthlyHistoryDocumentToDto(records)
  }

  public async getMonthlyMaintenanceHistory(
    carId: string,
    year: number,
  ): Promise<ResponseMonthlyHistoryDTO> {
    if (!year) year = new Date().getFullYear()
    const records =
      await this.databaseServiceHistoryRepository.getMonthlyMaintenanceHistory(
        carId,
        year,
      )
    return this.transformMonthlyHistoryDocumentToDto(records)
  }

  public async getMonthlyRefuelingHistory(
    carId: string,
    year: number,
  ): Promise<ResponseMonthlyRefuelingHistoryDTO> {
    if (!year) year = new Date().getFullYear()
    const records =
      await this.databaseServiceHistoryRepository.getMonthlyRefuelingHistory(
        carId,
        year,
      )
    return this.transformMonthlyHistoryByFuelTypeDocumentToDto(records)
  }

  public async getRefuelingHistory(
    id: string,
  ): Promise<ResponseRefuelingHistoryDTO> {
    const record =
      await this.databaseServiceHistoryRepository.getRefuelingHistory(id)
    return this.transformRefuelingHistoryDocumentToDto(record)
  }

  public async getWashHistory(id: string): Promise<ResponseWashHistoryDTO> {
    const record = await this.databaseServiceHistoryRepository.getWashHistory(
      id,
    )
    return this.transformWashHistoryDocumentToDto(record)
  }

  public async getMaintenanceHistory(
    id: string,
  ): Promise<ResponseMaintenanceHistoryDTO> {
    const record =
      await this.databaseServiceHistoryRepository.getMaintenanceHistory(id)
    return this.transformMaintenanceHistoryDocumentToDto(record)
  }

  public async getAllRefuelingHistory(
    carId: string,
  ): Promise<ResponseRefuelingHistoryDTO[]> {
    const records =
      await this.databaseServiceHistoryRepository.getAllRefuelingHistory(carId)
    return records.map((record) =>
      this.transformRefuelingHistoryDocumentToDto(record),
    )
  }

  public async getAllWashHistory(
    carId: string,
  ): Promise<ResponseWashHistoryDTO[]> {
    const records =
      await this.databaseServiceHistoryRepository.getAllWashHistory(carId)
    return records.map((record) =>
      this.transformWashHistoryDocumentToDto(record),
    )
  }

  public async getAllMaintenanceHistory(
    carId: string,
  ): Promise<ResponseMaintenanceHistoryDTO[]> {
    const records =
      await this.databaseServiceHistoryRepository.getAllMaintenanceHistory(
        carId,
      )
    return records.map((record) =>
      this.transformMaintenanceHistoryDocumentToDto(record),
    )
  }

  public async getAllMaintenanceHistoryByType(
    carId: string,
    type: ServiceHistoryTypeEnum,
  ): Promise<ResponseMaintenanceHistoryDTO[]> {
    const records =
      await this.databaseServiceHistoryRepository.getAllMaintenanceHistoryByType(
        carId,
        type,
      )
    return records.map((record) =>
      this.transformMaintenanceHistoryDocumentToDto(record),
    )
  }

  public async getAllRecords(carId: string): Promise<AllRecordsResponseDTO[]> {
    const refuelingRecords = await this.getAllRefuelingHistory(carId)
    const washRecords = await this.getAllWashHistory(carId)
    const maintenanceRecords = await this.getAllMaintenanceHistory(carId)
    const filteredRefueling = refuelingRecords.map(
      ({ id, car, gasStation, price, date, mileage, type }) => ({
        id,
        car,
        title: gasStation,
        price,
        date,
        mileage,
        type,
      }),
    )
    const filteredWash = washRecords.map(
      ({ id, car, name, price, date, mileage, type }) => ({
        id,
        car,
        title: name,
        price,
        date,
        mileage,
        type,
      }),
    )
    const filteredMaintenance = maintenanceRecords.map(
      ({ id, car, title, price, date, mileage, type }) => ({
        id,
        car,
        title,
        price,
        date,
        mileage,
        type,
      }),
    )
    return [...filteredRefueling, ...filteredWash, ...filteredMaintenance]
  }

  public async getFavoritesFuelStation(carId: string): Promise<string[]> {
    return this.databaseServiceHistoryRepository.getFavoritesFuelStation(carId)
  }

  public async getUserFavoritesFuelStation(token: string): Promise<string[]> {
    const { user } = await this.tokenService.verifyToken(token)
    return this.databaseServiceHistoryRepository.getUserFavoritesFuelStation(
      user,
    )
  }

  public async getFavoritesWashStation(carId: string): Promise<string[]> {
    return this.databaseServiceHistoryRepository.getFavoritesWashStation(carId)
  }

  public async getUserFavoritesWashStation(token: string): Promise<string[]> {
    const { user } = await this.tokenService.verifyToken(token)
    return this.databaseServiceHistoryRepository.getUserFavoritesWashStation(
      user,
    )
  }

  public async getFavoritesMaintenanceStation(
    carId: string,
  ): Promise<string[]> {
    return this.databaseServiceHistoryRepository.getFavoritesMaintenanceStation(
      carId,
    )
  }

  public async getUserFavoritesMaintenanceStation(
    token: string,
  ): Promise<string[]> {
    const { user } = await this.tokenService.verifyToken(token)
    return this.databaseServiceHistoryRepository.getUserFavoritesMaintenanceStation(
      user,
    )
  }

  public async createRefuelingHistory(
    carId: string,
    body: CreateRefuelingHistoryDTO,
    photos: Express.Multer.File[],
  ): Promise<ResponseRefuelingHistoryDTO> {
    const newRecord =
      await this.databaseServiceHistoryRepository.createRefuelingHistory(
        carId,
        body,
        photos,
      )
    const { car, mileage } = newRecord
    await this.databaseCarRepository.setMileage(car, mileage)
    return this.transformRefuelingHistoryDocumentToDto(newRecord)
  }

  public async createWashHistory(
    carId: string,
    body: CreateWashHistoryDTO,
    photos: Express.Multer.File[],
  ): Promise<ResponseWashHistoryDTO> {
    const newRecord =
      await this.databaseServiceHistoryRepository.createWashHistory(
        carId,
        body,
        photos,
      )
    const { car, mileage } = newRecord
    await this.databaseCarRepository.setMileage(car, mileage)
    return this.transformWashHistoryDocumentToDto(newRecord)
  }

  public async createMaintenanceHistory(
    carId: string,
    body: CreateMaintenanceHistoryDTO,
    photos: Express.Multer.File[],
    type: ServiceHistoryTypeEnum,
  ): Promise<ResponseMaintenanceHistoryDTO> {
    const newRecord =
      await this.databaseServiceHistoryRepository.createMaintenanceHistory(
        carId,
        body,
        photos,
        type,
      )
    const { car, mileage } = newRecord
    await this.databaseCarRepository.setMileage(car, mileage)
    return this.transformMaintenanceHistoryDocumentToDto(newRecord)
  }

  public async updateRefuelingHistory(
    id: string,
    body: UpdateRefuelingHistoryDTO,
    updatedPhotos: Express.Multer.File[],
  ): Promise<ResponseRefuelingHistoryDTO> {
    const updatedRecord =
      await this.databaseServiceHistoryRepository.updateRefuelingHistory(
        id,
        body,
        updatedPhotos,
      )
    const { car, mileage } = updatedRecord
    await this.databaseCarRepository.setMileage(car, mileage)
    return this.transformRefuelingHistoryDocumentToDto(updatedRecord)
  }

  public async updateWashHistory(
    id: string,
    body: UpdateWashHistoryDTO,
    updatedPhotos: Express.Multer.File[],
  ): Promise<ResponseWashHistoryDTO> {
    const updatedRecord =
      await this.databaseServiceHistoryRepository.updateWashHistory(
        id,
        body,
        updatedPhotos,
      )
    const { car, mileage } = updatedRecord
    await this.databaseCarRepository.setMileage(car, mileage)
    return this.transformWashHistoryDocumentToDto(updatedRecord)
  }

  public async updateMaintenanceHistory(
    id: string,
    body: UpdateMaintenanceHistoryDTO,
    updatedPhotos: Express.Multer.File[],
  ): Promise<ResponseMaintenanceHistoryDTO> {
    const updatedRecord =
      await this.databaseServiceHistoryRepository.updateMaintenanceHistory(
        id,
        body,
        updatedPhotos,
      )
    const { car, mileage } = updatedRecord
    await this.databaseCarRepository.setMileage(car, mileage)
    return this.transformMaintenanceHistoryDocumentToDto(updatedRecord)
  }

  private transformRefuelingHistoryDocumentToDto(
    record: RefuelingHistoryDocument,
  ): ResponseRefuelingHistoryDTO {
    const {
      id,
      car,
      gasStation,
      type,
      mileage,
      isFullTank,
      pricePerLiter,
      price,
      liters,
      fuelType,
      comment,
      isSaved,
      photos,
      date,
    } = record
    const signedUrls = photos.length
      ? photos.map((photo) => this.awsS3Service.getUrl(photo))
      : undefined
    return {
      id,
      car: car.toString(),
      gasStation,
      type,
      mileage,
      isFullTank,
      pricePerLiter,
      price,
      liters,
      fuelType,
      comment,
      isSaved,
      photos: signedUrls,
      date,
    }
  }

  private transformWashHistoryDocumentToDto(
    record: WashHistoryDocument,
  ): ResponseWashHistoryDTO {
    const {
      id,
      car,
      name,
      type,
      mileage,
      price,
      comment,
      isSaved,
      photos,
      date,
    } = record
    const signedUrls = photos.length
      ? photos.map((photo) => this.awsS3Service.getUrl(photo))
      : undefined
    return {
      id,
      car: car.toString(),
      name,
      type,
      mileage,
      price,
      comment,
      isSaved,
      photos: signedUrls,
      date,
    }
  }

  private transformMaintenanceHistoryDocumentToDto(
    record: MaintenanceHistoryDocument,
  ): ResponseMaintenanceHistoryDTO {
    const {
      id,
      title,
      type,
      serviceStation,
      mileage,
      carRepairing,
      sparePart,
      price,
      comment,
      isSaved,
      photos,
      date,
      car,
    } = record
    const signedUrls = photos.length
      ? photos.map((photo) => this.awsS3Service.getUrl(photo))
      : undefined
    return {
      id,
      car: car.toString(),
      title,
      type,
      serviceStation,
      mileage,
      carRepairing,
      sparePart,
      price,
      comment,
      isSaved,
      photos: signedUrls,
      date,
    }
  }

  private transformMonthlyHistoryDocumentToDto(
    records: IRepositoryMonthlyHistory[],
  ): ResponseMonthlyHistoryDTO {
    const months = {
      '1': 'january',
      '2': 'february',
      '3': 'march',
      '4': 'april',
      '5': 'may',
      '6': 'june',
      '7': 'july',
      '8': 'august',
      '9': 'september',
      '10': 'october',
      '11': 'november',
      '12': 'december',
    }

    return records.reduce((result, record) => {
      const monthIndex = record._id.month
      const month = months[`${monthIndex}`]
      result[month] = record.amount
      return result
    }, {})
  }

  private transformMonthlyHistoryByFuelTypeDocumentToDto(
    records: IRepositoryMonthlyFuelHistory[],
  ): ResponseMonthlyRefuelingHistoryDTO {
    const months = {
      '1': 'january',
      '2': 'february',
      '3': 'march',
      '4': 'april',
      '5': 'may',
      '6': 'june',
      '7': 'july',
      '8': 'august',
      '9': 'september',
      '10': 'october',
      '11': 'november',
      '12': 'december',
    }

    return records.reduce((result, record) => {
      const monthIndex = record._id
      const month = months[`${monthIndex}`]

      const monthData = record.fuelTypes.reduce((result, item) => {
        const fuelType = item.fuelType
        result[fuelType] = item.amount
        return result
      }, {})

      result[month] = monthData
      return result
    }, {})
  }
}
