import { Injectable } from '@nestjs/common'
import { Types } from 'mongoose'

import TokenService from 'src/token/token.service'
import { DatabaseDocumentsRepository } from './documents-db.repository'
import { CreateDriverLicenseDTO } from './dto/driver-license/create-driver-license.dto'
import { ResponseDriverLicenseDTO } from './dto/driver-license/response-driver-license.dto'
import { UpdateDriverLicenseDTO } from './dto/driver-license/update-driver-license.dto'
import { CreateINNDTO } from './dto/inn/create-inn.dto'
import { ResponseINNDTO } from './dto/inn/response-inn.dto'
import { UpdateINNDTO } from './dto/inn/update-inn.dto'
import { CreateTechnicalPassportDTO } from './dto/technical-passport/create-technical-passport.dto'
import { ResponseTechnicalPassportDTO } from './dto/technical-passport/response-technical-passport.dto'
import { UpdateTechnicalPassportDTO } from './dto/technical-passport/update-technical-passport.dto'
import { DocumentTypesEnum } from './enums/document-types.enum'
import { DriverLicenseDocument } from './schemas/driver-license.schema'
import { INNDocument } from './schemas/inn.schema'
import { TechnicalPassportDocument } from './schemas/technical-passport.schema'

@Injectable()
export class DocumentsService {
  constructor(
    private readonly databaseDocumentsRepository: DatabaseDocumentsRepository,
    private readonly tokenService: TokenService,
  ) {}

  public async deleteDocumentsByUserByUser(
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.databaseDocumentsRepository.deleteDriverLicenseByUser(userId)
    await this.databaseDocumentsRepository.deleteINNByUser(userId)
    await this.databaseDocumentsRepository.deleteTechnicalPassportByUser(userId)
  }

  public async getDocuments(
    token: string,
  ): Promise<
    (ResponseDriverLicenseDTO | ResponseINNDTO | ResponseTechnicalPassportDTO)[]
  > {
    const { user } = await this.tokenService.verifyToken(token)
    const licenses = await this.databaseDocumentsRepository.getAllDriverLicenes(
      user,
    )
    const inns = await this.databaseDocumentsRepository.getAllInns(user)
    const passports =
      await this.databaseDocumentsRepository.getAllTechnicalPassports(user)
    const transformedLicenses = licenses.map((license) =>
      this.transformDriverLicenseDocumentToDto(license),
    )

    const transformedInns = inns.map((inn) =>
      this.transformINNDocumentToDto(inn),
    )
    const transformedPassports = passports.map((passport) =>
      this.transformTechnicalPassportDocumentToDto(passport),
    )

    return [...transformedLicenses, ...transformedInns, ...transformedPassports]
  }

  public async getDriverLicense(id: string): Promise<ResponseDriverLicenseDTO> {
    const license = await this.databaseDocumentsRepository.getDriverLicene(id)
    return this.transformDriverLicenseDocumentToDto(license)
  }

  public async getByDriverLicense(
    driverLicense: string,
  ): Promise<ResponseDriverLicenseDTO> {
    const driverLicenseDocument =
      await this.databaseDocumentsRepository.findDriverLicense(driverLicense)

    return this.transformDriverLicenseDocumentToDto(driverLicenseDocument)
  }

  public async getInn(id: string): Promise<ResponseINNDTO> {
    const inn = await this.databaseDocumentsRepository.getInn(id)
    return this.transformINNDocumentToDto(inn)
  }

  public async getTechnicalPassport(
    id: string,
  ): Promise<ResponseTechnicalPassportDTO> {
    const license = await this.databaseDocumentsRepository.getTechnicalPassport(
      id,
    )
    return this.transformTechnicalPassportDocumentToDto(license)
  }

  public async createDriverLicense(
    license: CreateDriverLicenseDTO,
    token: string,
  ): Promise<ResponseDriverLicenseDTO> {
    const { user } = await this.tokenService.verifyToken(token)
    const newLicense =
      await this.databaseDocumentsRepository.createDriverLicense(license, user)
    return this.transformDriverLicenseDocumentToDto(newLicense)
  }

  public async createINN(
    inn: CreateINNDTO,
    token: string,
  ): Promise<ResponseINNDTO> {
    const { user } = await this.tokenService.verifyToken(token)
    const newINN = await this.databaseDocumentsRepository.createINN(inn, user)
    return this.transformINNDocumentToDto(newINN)
  }

  public async createTechnicalPassport(
    technicalPassport: CreateTechnicalPassportDTO,
    token: string,
  ): Promise<ResponseTechnicalPassportDTO> {
    const { user } = await this.tokenService.verifyToken(token)
    const newTechnicalPassport =
      await this.databaseDocumentsRepository.createTechnicalPassport(
        technicalPassport,
        user,
      )
    return this.transformTechnicalPassportDocumentToDto(newTechnicalPassport)
  }

  public async updateDriverLicense(
    id: string,
    license: UpdateDriverLicenseDTO,
  ): Promise<ResponseDriverLicenseDTO> {
    const updatedLicense =
      await this.databaseDocumentsRepository.updateDriverLicense(id, license)
    return this.transformDriverLicenseDocumentToDto(updatedLicense)
  }

  public async updateINN(
    id: string,
    inn: UpdateINNDTO,
  ): Promise<ResponseINNDTO> {
    const updatedINN = await this.databaseDocumentsRepository.updateINN(id, inn)
    return this.transformINNDocumentToDto(updatedINN)
  }

  public async updateTechnicalPassport(
    id: string,
    technicalPassport: UpdateTechnicalPassportDTO,
  ): Promise<ResponseTechnicalPassportDTO> {
    const updatedTechnicalPassport =
      await this.databaseDocumentsRepository.updateTechnicalPassport(
        id,
        technicalPassport,
      )
    return this.transformTechnicalPassportDocumentToDto(
      updatedTechnicalPassport,
    )
  }

  private transformDriverLicenseDocumentToDto(
    license: DriverLicenseDocument,
  ): ResponseDriverLicenseDTO {
    const { id, series, number, date, user } = license
    return {
      id,
      series,
      number,
      date,
      user: user.toString(),
      type: DocumentTypesEnum.DRIVER_LICENSE,
    }
  }

  private transformINNDocumentToDto(inn: INNDocument): ResponseINNDTO {
    const { id, number, carNumber } = inn
    return { id, number, carNumber, type: DocumentTypesEnum.INN }
  }

  private transformTechnicalPassportDocumentToDto(
    technicalPassport: TechnicalPassportDocument,
  ): ResponseTechnicalPassportDTO {
    const { id, series, number, carNumber } = technicalPassport
    return {
      id,
      series,
      number,
      carNumber,
      type: DocumentTypesEnum.TECHNICAL_PASSPORT,
    }
  }
}
