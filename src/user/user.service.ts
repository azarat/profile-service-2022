import { Injectable } from '@nestjs/common'
import { DatabaseServiceHistoryRepository } from 'src/service-history/service-history-db.repository'

import DatabaseUserRepository from './user-db.repository'
import UserRegistrationDTO from '../auth/dto/user-registration.dto'
import UserDTO from './dto/user.dto'
import { UserDocument } from './schemas/user.schema'
import { UserStatusEnum } from './enums/status.enum'
import { AwsS3Service } from 'src/aws/aws-s3.service'
import { OmnicellService } from 'src/omnicell/omnicell.service'
import { SendStatusEnum } from 'src/omnicell/enums/send-sms.enum'
import UpdatePhoneDTO from './dto/update-phone.dto'
import UserUpdateDTO from './dto/update-user.dto'
import TokenService from 'src/token/token.service'
import { UserBaseSdkRepsonseDTO, UserSdkRepsonseDTO } from './dto/user-sdk-response.dto'
import { DatabaseCarRepository } from '../car/car-db.repository'
import { DocumentsService } from 'src/documents/documents.service'
import { InsuranceService } from 'src/insurance/insurance.service'

@Injectable()
export class UserService {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly databaseUserRepository: DatabaseUserRepository,
    private readonly awsS3Service: AwsS3Service,
    private readonly omnicellService: OmnicellService,
    private readonly tokenService: TokenService,
    private readonly databaseCarRepository: DatabaseCarRepository,
    private readonly databaseServiceHistoryRepository: DatabaseServiceHistoryRepository,
    private readonly insuranceService: InsuranceService,
  ) {}

  public async deleteUser(id: string, token: string): Promise<void> {
    const { user: userId } = await this.tokenService.verifyToken(token)
    const { photo } = await this.databaseUserRepository.findById(userId)
    await this.documentsService.deleteDocumentsByUserByUser(userId)
    await this.insuranceService.deleteInsurancesByUser(userId)
    if (photo) {
      await this.deleteAvatar(token)
    }
    const cars = await this.databaseCarRepository.getCars(userId)
    await Promise.all(
      cars.map(async (car) => {
        const { _id: carId } = car
        await this.databaseCarRepository.deleteCar(carId)
        await this.databaseServiceHistoryRepository.deleteHistoriesByCar(carId)
      }),
    )
    await this.databaseUserRepository.deleteUser(id)
  }

  public async createUser(
    body: UserRegistrationDTO,
    deviceToken: string,
  ): Promise<void> {
    await this.databaseUserRepository.createUser(
      body,
      deviceToken,
      UserStatusEnum.PENDING,
    )
  }

  public async updateUserProfile(
    id: string,
    body: UserUpdateDTO,
    photo: Express.Multer.File,
  ): Promise<UserDTO> {
    const { phone, ...userData } = body
    const userDocument = await this.databaseUserRepository.updateUserById(
      { id, ...userData },
      photo,
    )
    if (phone) await this.omnicellService.sendSMS(phone, SendStatusEnum.CHANGE)
    return this.transformUserDocumentToDto(userDocument)
  }

  public async confirmPhoneUpdate(
    id: string,
    { code, phone }: UpdatePhoneDTO,
  ): Promise<UserDTO> {
    await this.omnicellService.omnicellVerify(code, phone)
    const userDocument = await this.databaseUserRepository.updateUserById({
      id,
      phone,
    })
    return this.transformUserDocumentToDto(userDocument)
  }

  public async deleteAvatar(token: string): Promise<void> {
    const { user } = await this.tokenService.verifyToken(token)
    await this.databaseUserRepository.deleteAvatar(user)
  }

  public transformUserDocumentToDto(userDocument: UserDocument): UserDTO {
    const { id, name, phone, email, city, photo } = userDocument
    return {
      id,
      name,
      phone,
      email,
      city,
      photo: photo && this.awsS3Service.getUrl(photo),
    }
  }

  public async verifyUser(token: string): Promise<UserSdkRepsonseDTO> {
    const { user: id } = await this.tokenService.verifyToken(token)
    const { phone, deviceToken } = await this.databaseUserRepository.findById(
      id,
    )
    return { id, phone, deviceToken }
  }

  public async getById(userId: string): Promise<UserSdkRepsonseDTO> {
    const { id, phone, deviceToken } =
      await this.databaseUserRepository.findById(userId)
    return { id, phone, deviceToken }
  }

  public async getBaseById(userId: string): Promise<UserBaseSdkRepsonseDTO> {
    const { id, phone, name } =
      await this.databaseUserRepository.findById(userId)
    return { id, phone, name }
  }
}
