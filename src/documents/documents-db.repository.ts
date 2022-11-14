import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { CreateDriverLicenseDTO } from './dto/driver-license/create-driver-license.dto'
import { UpdateDriverLicenseDTO } from './dto/driver-license/update-driver-license.dto'
import { CreateINNDTO } from './dto/inn/create-inn.dto'
import { UpdateINNDTO } from './dto/inn/update-inn.dto'
import { CreateTechnicalPassportDTO } from './dto/technical-passport/create-technical-passport.dto'
import { UpdateTechnicalPassportDTO } from './dto/technical-passport/update-technical-passport.dto'
import {
  DriverLicense,
  DriverLicenseDocument,
} from './schemas/driver-license.schema'
import { INN, INNDocument } from './schemas/inn.schema'
import {
  TechnicalPassport,
  TechnicalPassportDocument,
} from './schemas/technical-passport.schema'
import { LocalizeError } from 'src/errors/localize.error'

@Injectable()
export class DatabaseDocumentsRepository {
  constructor(
    @InjectModel(DriverLicense.name)
    private readonly driverLicenseModel: Model<DriverLicenseDocument>,
    @InjectModel(INN.name)
    private readonly INNModel: Model<INNDocument>,
    @InjectModel(TechnicalPassport.name)
    private readonly technicalPassportModel: Model<TechnicalPassportDocument>,
  ) {}

  public async deleteDriverLicenseByUser(
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.driverLicenseModel.deleteMany({
      user: userId,
    })
  }

  public async deleteINNByUser(userId: Types.ObjectId): Promise<void> {
    await this.INNModel.deleteMany({
      user: userId,
    })
  }

  public async deleteTechnicalPassportByUser(
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.technicalPassportModel.deleteMany({
      user: userId,
    })
  }

  public async getAllDriverLicenes(
    user: Types.ObjectId,
  ): Promise<DriverLicenseDocument[]> {
    return this.driverLicenseModel.find({ user })
  }

  public async getAllInns(user: Types.ObjectId): Promise<INNDocument[]> {
    return this.INNModel.find({ user })
  }

  public async getAllTechnicalPassports(
    user: Types.ObjectId,
  ): Promise<TechnicalPassportDocument[]> {
    return this.technicalPassportModel.find({ user })
  }

  public async getDriverLicene(id: string): Promise<DriverLicenseDocument> {
    const res = await this.driverLicenseModel.findById(id)
    this.validAction(res)
    return res
  }

  public transformSeries(series: string) {
    const mapObj = {
      К: 'K',
      Е: 'E',
      Н: 'H',
      І: 'I',
      В: 'B',
      А: 'A',
      Р: 'P',
      О: 'O',
      С: 'C',
      М: 'M',
      Т: 'T',
      Х: 'X',
    }
    series = series.replace(/К|Е|Н|І|В|А|Р|О|С|М|Т|Х/gi, function (matched) {
      return mapObj[matched]
    })
    return series
  }
  public async findDriverLicense(
    driverLicense: string,
  ): Promise<DriverLicenseDocument> {
    const decodeDriverLicense = decodeURI(driverLicense)
    const series = decodeDriverLicense.substring(0, 3)
    const number = decodeDriverLicense.substring(3, decodeDriverLicense.length)
    const transformSeries = this.transformSeries(series)
    const driverLicenseDocument = await this.driverLicenseModel.findOne({
      $or: [
        { number, series },
        { number, transformSeries },
      ],
    })
    return driverLicenseDocument
  }

  public async findTechnicalPassport(
    technicalPassport: string,
  ): Promise<TechnicalPassportDocument> {
    const decodeTechnicalPassport = decodeURI(technicalPassport)
    const series = decodeTechnicalPassport.substring(0, 3)
    const number = decodeTechnicalPassport.substring(
      3,
      decodeTechnicalPassport.length,
    )

    const transformSeries = this.transformSeries(series)
    const technicalPassportDocument = await this.technicalPassportModel.findOne(
      {
        $or: [
          { number, series },
          { number, transformSeries },
        ],
      },
    )

    return technicalPassportDocument
  }

  public async getInn(id: string): Promise<INNDocument> {
    const res = await this.INNModel.findById(id)
    this.validAction(res)
    return res
  }
  public async getTechnicalPassport(
    id: string,
  ): Promise<TechnicalPassportDocument> {
    const res = await this.technicalPassportModel.findById(id)
    this.validAction(res)
    return res
  }

  public async createDriverLicense(
    license: CreateDriverLicenseDTO,
    user: Types.ObjectId,
  ): Promise<DriverLicenseDocument> {
    const amount = await this.getDocumentsAmount(user)
    if (amount >= +process.env.MAX_DOCUMENTS)
      throw new LocalizeError(
        LocalizeError.DOCUMENTS_LIMITATION,
        HttpStatus.CONFLICT,
      )
    return this.driverLicenseModel.create({ ...license, user })
  }

  public async createINN(
    INN: CreateINNDTO,
    user: Types.ObjectId,
  ): Promise<INNDocument> {
    const amount = await this.getDocumentsAmount(user)
    if (amount >= +process.env.MAX_DOCUMENTS)
      throw new LocalizeError(
        LocalizeError.DOCUMENTS_LIMITATION,
        HttpStatus.CONFLICT,
      )
    return this.INNModel.create({ ...INN, user })
  }

  public async createTechnicalPassport(
    technicalPassport: CreateTechnicalPassportDTO,
    user: Types.ObjectId,
  ): Promise<TechnicalPassportDocument> {
    const amount = await this.getDocumentsAmount(user)
    if (amount >= +process.env.MAX_DOCUMENTS)
      throw new LocalizeError(
        LocalizeError.DOCUMENTS_LIMITATION,
        HttpStatus.CONFLICT,
      )
    return this.technicalPassportModel.create({
      ...technicalPassport,
      user,
    })
  }

  public async updateDriverLicense(
    id: string,
    license: UpdateDriverLicenseDTO,
  ): Promise<DriverLicenseDocument> {
    const res = await this.driverLicenseModel.findByIdAndUpdate(id, license)
    this.validAction(res)
    return this.driverLicenseModel.findById(id)
  }

  public async updateINN(id: string, inn: UpdateINNDTO): Promise<INNDocument> {
    const res = await this.INNModel.findByIdAndUpdate(id, inn)
    this.validAction(res)
    return this.INNModel.findById(id)
  }

  public async updateTechnicalPassport(
    id: string,
    technicalPassport: UpdateTechnicalPassportDTO,
  ): Promise<TechnicalPassportDocument> {
    const res = await this.technicalPassportModel.findByIdAndUpdate(
      id,
      technicalPassport,
    )
    this.validAction(res)
    return this.technicalPassportModel.findById(id)
  }

  public async deleteDriverLicense(id: string): Promise<void> {
    const res = await this.driverLicenseModel.findByIdAndDelete(id)
    this.validAction(res)
  }

  public async deleteINN(id: string): Promise<void> {
    const res = await this.INNModel.findByIdAndDelete(id)
    this.validAction(res)
  }

  public async deleteTechnicalPassport(id: string): Promise<void> {
    const res = await this.technicalPassportModel.findByIdAndDelete(id)
    this.validAction(res)
  }

  private validAction(res): void {
    if (!res)
      throw new HttpException(
        `Record with this id doesn't exist`,
        HttpStatus.BAD_REQUEST,
      )
  }

  private async getDocumentsAmount(user: Types.ObjectId): Promise<number> {
    const licenses = await this.driverLicenseModel.find({ user })
    const inns = await this.INNModel.find({ user })
    const passports = await this.technicalPassportModel.find({ user })
    return [...licenses, ...inns, ...passports].length
  }
}
