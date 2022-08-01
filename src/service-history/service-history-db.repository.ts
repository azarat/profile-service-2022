import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { DatabaseCarRepository } from '../car/car-db.repository'
import { AwsS3Service } from 'src/aws/aws-s3.service'
import { LocalizeError } from 'src/errors/localize.error'
import { CreateMaintenanceHistoryDTO } from './dto/maintenance-history/create-maintenance-history.dto'
import { UpdateMaintenanceHistoryDTO } from './dto/maintenance-history/update-maintenance-history.dto'
import { CreateRefuelingHistoryDTO } from './dto/refueling-history/create-refueling-history.dto'
import { UpdateRefuelingHistoryDTO } from './dto/refueling-history/update-refueling-history.dto'
import { CreateWashHistoryDTO } from './dto/wash-history/create-wash-history.dto'
import { UpdateWashHistoryDTO } from './dto/wash-history/update-wash-history.dto'
import { ServiceHistoryTypeEnum } from './enums/maintenance.enum'
import { IRepositoryMonthlyHistory } from './interfaces/repository-monthly-history.interface'
import { IRepositoryMonthlyFuelHistory } from './interfaces/repository-monthly-fuel-history.interface'
import {
  MaintenanceHistory,
  MaintenanceHistoryDocument,
} from './schemas/maintenance-history.schema'
import {
  RefuelingHistory,
  RefuelingHistoryDocument,
} from './schemas/refueling-history.schema'
import { WashHistory, WashHistoryDocument } from './schemas/wash-history.schema'

@Injectable()
export class DatabaseServiceHistoryRepository {
  constructor(
    @InjectModel(RefuelingHistory.name)
    private readonly refuelingHistoryModel: Model<RefuelingHistoryDocument>,
    @InjectModel(WashHistory.name)
    private readonly washHistoryModel: Model<WashHistoryDocument>,
    @InjectModel(MaintenanceHistory.name)
    private readonly maintenanceHistoryModel: Model<MaintenanceHistoryDocument>,
    private readonly awsS3Service: AwsS3Service,
    private readonly databaseCarRepository: DatabaseCarRepository,
  ) {}

  public async getMonthlyWashHistory(
    car: string,
    year: number,
  ): Promise<IRepositoryMonthlyHistory[]> {
    const record = await this.monthlyQuery(car, year, this.washHistoryModel)
    this.validAction(record)
    return record
  }

  public async getMonthlyMaintenanceHistory(
    car: string,
    year: number,
  ): Promise<IRepositoryMonthlyHistory[]> {
    const record = await this.monthlyQuery(
      car,
      year,
      this.maintenanceHistoryModel,
    )
    this.validAction(record)
    return record
  }

  private monthlyQuery(
    car: string,
    year: number,
    model,
  ): Promise<IRepositoryMonthlyHistory[]> {
    return model.aggregate([
      {
        $match: {
          car: new Types.ObjectId(car),
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$date' } },
          amount: { $sum: '$price' },
        },
      },
    ])
  }

  public async getMonthlyRefuelingHistory(
    car: string,
    year: number,
  ): Promise<IRepositoryMonthlyFuelHistory[]> {
    const record = await this.monthlyQueryByFuelType(
      car,
      year,
      this.refuelingHistoryModel,
    )
    this.validAction(record)
    return record
  }

  private monthlyQueryByFuelType(
    car: string,
    year: number,
    model,
  ): Promise<IRepositoryMonthlyFuelHistory[]> {
    return model.aggregate([
      {
        $match: {
          car: new Types.ObjectId(car),
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$date' }, fuelType: '$fuelType' },
          amount: { $sum: '$price' },
        },
      },
      {
        $group: {
          _id: '$_id.month',
          fuelTypes: {
            $push: { fuelType: '$_id.fuelType', amount: '$amount' },
          },
        },
      },
    ])
  }

  public async getRefuelingHistory(
    id: string,
  ): Promise<RefuelingHistoryDocument> {
    const record = await this.refuelingHistoryModel.findById(id)
    this.validAction(record)
    return record
  }

  public async getWashHistory(id: string): Promise<WashHistoryDocument> {
    const record = await this.washHistoryModel.findById(id)
    this.validAction(record)
    return record
  }

  public async getMaintenanceHistory(
    id: string,
  ): Promise<MaintenanceHistoryDocument> {
    const record = await this.maintenanceHistoryModel.findById(id)
    this.validAction(record)
    return record
  }

  public async getAllRefuelingHistory(
    car: string,
  ): Promise<RefuelingHistoryDocument[]> {
    return this.refuelingHistoryModel
      .find({ car: new Types.ObjectId(car) })
      .sort([['date', -1]])
  }

  public async getAllWashHistory(car: string): Promise<WashHistoryDocument[]> {
    return this.washHistoryModel
      .find({ car: new Types.ObjectId(car) })
      .sort([['date', -1]])
  }

  public async getAllMaintenanceHistory(
    car: string,
  ): Promise<MaintenanceHistoryDocument[]> {
    return this.maintenanceHistoryModel
      .find({ car: new Types.ObjectId(car) })
      .sort([['date', -1]])
  }

  public async getAllMaintenanceHistoryByType(
    car: string,
    type: ServiceHistoryTypeEnum,
  ): Promise<MaintenanceHistoryDocument[]> {
    return this.maintenanceHistoryModel
      .find({ car: new Types.ObjectId(car), type })
      .sort([['date', -1]])
  }

  public async getFavoritesFuelStation(car: string): Promise<string[]> {
    return this.refuelingHistoryModel
      .find({ car: new Types.ObjectId(car), isSaved: true }, 'gasStation')
      .distinct('gasStation')
  }

  public async getUserFavoritesFuelStation(
    user: Types.ObjectId,
  ): Promise<string[]> {
    const cars = await this.databaseCarRepository.getCars(user)
    const carsId = cars.map((car) => ({ car: car._id, isSaved: true }))

    return this.refuelingHistoryModel
      .find({ $or: carsId }, 'gasStation')
      .distinct('gasStation')
  }

  public async getFavoritesWashStation(car: string): Promise<string[]> {
    return this.washHistoryModel
      .find({ car: new Types.ObjectId(car), isSaved: true }, 'name')
      .distinct('name')
  }

  public async getUserFavoritesWashStation(
    user: Types.ObjectId,
  ): Promise<string[]> {
    const cars = await this.databaseCarRepository.getCars(user)
    const carsId = cars.map((car) => ({ car: car._id, isSaved: true }))

    return this.washHistoryModel.find({ $or: carsId }, 'name').distinct('name')
  }

  public async getFavoritesMaintenanceStation(car: string): Promise<string[]> {
    return this.maintenanceHistoryModel
      .find({ car: new Types.ObjectId(car), isSaved: true }, 'serviceStation')
      .distinct('serviceStation')
  }

  public async getUserFavoritesMaintenanceStation(
    user: Types.ObjectId,
  ): Promise<string[]> {
    const cars = await this.databaseCarRepository.getCars(user)
    const carsId = cars.map((car) => ({ car: car._id, isSaved: true }))

    return this.maintenanceHistoryModel
      .find({ $or: carsId }, 'serviceStation')
      .distinct('serviceStation')
  }

  public async createRefuelingHistory(
    car: string,
    body: CreateRefuelingHistoryDTO,
    photos: Express.Multer.File[],
  ): Promise<RefuelingHistoryDocument> {
    return this.refuelingHistoryModel.create({
      ...body,
      date: body.date,
      photos: photos && (await this.uploadPhotosService(photos)),
      type: ServiceHistoryTypeEnum.REFUELING,
      car: new Types.ObjectId(car),
    })
  }

  public async createWashHistory(
    car: string,
    body: CreateWashHistoryDTO,
    photos: Express.Multer.File[],
  ): Promise<WashHistoryDocument> {
    return this.washHistoryModel.create({
      ...body,
      date: body.date,
      photos: photos && (await this.uploadPhotosService(photos)),
      type: ServiceHistoryTypeEnum.CARWASH,
      car: new Types.ObjectId(car),
    })
  }

  public async createMaintenanceHistory(
    car: string,
    body: CreateMaintenanceHistoryDTO,
    photos: Express.Multer.File[],
    type: ServiceHistoryTypeEnum,
  ): Promise<MaintenanceHistoryDocument> {
    return this.maintenanceHistoryModel.create({
      ...body,
      date: body.date,
      photos: photos && (await this.uploadPhotosService(photos)),
      type,
      car: new Types.ObjectId(car),
    })
  }

  public async updateRefuelingHistory(
    id: string,
    body: UpdateRefuelingHistoryDTO,
    updatedPhotos: Express.Multer.File[],
  ): Promise<RefuelingHistoryDocument> {
    const record = await this.refuelingHistoryModel.findById(id)
    this.validAction(record)

    const { date, deletedPhotos } = body
    await this.refuelingHistoryModel.findByIdAndUpdate(id, {
      ...body,
      date: date ? date : record.date,
      photos: await this.filterNewPhotos(
        record.photos,
        updatedPhotos,
        deletedPhotos,
      ),
    })
    return this.refuelingHistoryModel.findById(id)
  }

  public async updateWashHistory(
    id: string,
    body: UpdateWashHistoryDTO,
    updatedPhotos: Express.Multer.File[],
  ): Promise<WashHistoryDocument> {
    const record = await this.washHistoryModel.findById(id)
    this.validAction(record)

    const { date, deletedPhotos } = body
    await this.washHistoryModel.findByIdAndUpdate(id, {
      ...body,
      date: date ? date : record.date,
      photos: await this.filterNewPhotos(
        record.photos,
        updatedPhotos,
        deletedPhotos,
      ),
    })
    return this.washHistoryModel.findById(id)
  }

  public async updateMaintenanceHistory(
    id: string,
    body: UpdateMaintenanceHistoryDTO,
    updatedPhotos: Express.Multer.File[],
  ): Promise<MaintenanceHistoryDocument> {
    const record = await this.maintenanceHistoryModel.findById(id)
    this.validAction(record)

    const { date, deletedPhotos } = body
    await this.maintenanceHistoryModel.findByIdAndUpdate(id, {
      ...body,
      date: date ? date : record.date,
      photos: await this.filterNewPhotos(
        record.photos,
        updatedPhotos,
        deletedPhotos,
      ),
    })
    return this.maintenanceHistoryModel.findById(id)
  }

  public async deleteRefuelingHistory(id: string): Promise<void> {
    const res = await this.refuelingHistoryModel.findByIdAndDelete(id)
    this.validAction(res)
  }

  public async deleteWashHistory(id: string): Promise<void> {
    const res = await this.washHistoryModel.findByIdAndDelete(id)
    this.validAction(res)
  }

  public async deleteMaintenanceHistory(id: string): Promise<void> {
    const res = await this.maintenanceHistoryModel.findByIdAndDelete(id)
    this.validAction(res)
  }

  public async deleteHistoriesByCar(car: string): Promise<void> {
    await this.refuelingHistoryModel.deleteMany({
      car: new Types.ObjectId(car),
    })
    await this.washHistoryModel.deleteMany({
      car: new Types.ObjectId(car),
    })
    await this.maintenanceHistoryModel.deleteMany({
      car: new Types.ObjectId(car),
    })
  }

  private validAction(res): void {
    if (!res)
      throw new HttpException(
        `Record with this id doesn't exist`,
        HttpStatus.BAD_REQUEST,
      )
  }

  private async filterNewPhotos(
    oldPhotos: string[],
    updatedPhotos: Express.Multer.File[],
    deletedPhotos: string[] = [],
  ): Promise<string[]> {
    const deletedPhotoNames = this.parseLink(deletedPhotos)
    await this.deletePhotosService(deletedPhotoNames)
    const withoutDeleted = oldPhotos.filter(
      (item) => !deletedPhotoNames.includes(item),
    )
    const newPhotos = await this.uploadPhotosService(updatedPhotos)
    const result = [...withoutDeleted, ...newPhotos]
    if (result.length > 6)
      throw new LocalizeError(
        LocalizeError.TOO_MANY_PHOTOS,
        HttpStatus.BAD_REQUEST,
      )
    return result
  }

  private async uploadPhotosService(
    photos: Express.Multer.File[],
  ): Promise<string[]> {
    if (!photos) return []
    return Promise.all(
      photos.map(({ buffer, originalname }) =>
        this.awsS3Service.uploadFile(
          buffer,
          originalname,
          process.env.RECORDS_FOLDER,
        ),
      ),
    )
  }

  private async deletePhotosService(deletedPhotos: string[]): Promise<void> {
    if (!deletedPhotos.length) return
    await Promise.all(
      deletedPhotos.map((photo) => this.awsS3Service.deleteFile(photo)),
    )
  }

  private parseLink(links: string[]): string[] {
    if (!links.length) return []
    return links.map(
      (link) =>
        'service-history' + link.split('?')[0].split('service-history')[1],
    )
  }
}
