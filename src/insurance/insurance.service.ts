import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { Types } from 'mongoose'

import { DatabaseInsuranceRepository } from './insurance-db.repository'
import InsuranceResponseDTO from './dto/insurance-response.dto'
import CreateInsuranceDTO from './dto/create-insurance.dto'
import TokenService from 'src/token/token.service'
import { InsuranceDocument } from './schemas/insurance.schema'
import { AwsS3Service } from 'src/aws/aws-s3.service'
import UpdateInsuranceDTO from './dto/update-insurance.dto'
import axios from 'axios'
import { ConfigService } from '@nestjs/config'
import { UserService } from 'src/user/user.service'

@Injectable()
export class InsuranceService {
  constructor(
    private configService: ConfigService,
    private readonly databaseInsuranceRepository: DatabaseInsuranceRepository,
    private readonly awsS3Service: AwsS3Service,
    private readonly tokenService: TokenService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async deleteInsurancesByUser(userId: Types.ObjectId): Promise<void> {
    await this.databaseInsuranceRepository.deleteInsurancesByUser(userId)
  }

  public async createInsurance(
    token: string,
    body: CreateInsuranceDTO,
    file: Express.Multer.File,
  ): Promise<InsuranceResponseDTO> {
    const { user } = await this.tokenService.verifyToken(token)
    const newInsurance = await this.databaseInsuranceRepository.createInsurance(
      user,
      body,
      file,
    )
    return this.transformInsuranceDocumentToDto(newInsurance)
  }

  public async getInsurances(token: string): Promise<InsuranceResponseDTO[]> {
    const { user } = await this.tokenService.verifyToken(token)
    const insurances = await this.databaseInsuranceRepository.getInsurances(
      user,
    )
    return insurances.map((insurance) =>
      this.transformInsuranceDocumentToDto(insurance),
    )
  }

  public async sendWarnPush(): Promise<boolean> {
    const insurances = await this.databaseInsuranceRepository.getExpireInsurances(10)
    
    let devicesTokens = []
    for (var _i of insurances) {
      const user = await this.userService.getById(_i.user.toString())
      devicesTokens.push(user.deviceToken)
    }

    devicesTokens = devicesTokens.flat(1).filter((_token: string) => !devicesTokens.includes(_token))    

    await axios.post(
      this.configService.get('pushNotificationsUri'),
      {
        tokens: devicesTokens,
        notification: {
          title: 'Повідомленя від DayDrive.Страховки',
          body: 'До закінчення терміну дії Вашого поліса залишились 10 днів.',
        },
        data: {
          type: "POLICY_EXPIRES"
        },
      },
      {
        headers: {
          token: this.configService.get('pushLambdaSecret'),
        },
      },
    )

    return true
  }

  public async getById(
    token: string,
    id: string,
  ): Promise<InsuranceResponseDTO> {
    const { user } = await this.tokenService.verifyToken(token)
    const insurance = await this.databaseInsuranceRepository.findById(id)
    return this.transformInsuranceDocumentToDto(insurance)
  }

  public async deleteInsurance(id: string): Promise<void> {
    await this.databaseInsuranceRepository.deleteInsurance(id)
  }

  public async updateInsurance(
    id: string,
    body: UpdateInsuranceDTO,
    file: Express.Multer.File,
  ): Promise<InsuranceResponseDTO> {
    const insuranceDocument =
      await this.databaseInsuranceRepository.updateInsuranceById(id, body, file)
    return this.transformInsuranceDocumentToDto(insuranceDocument)
  }

  private transformInsuranceDocumentToDto(
    insurance: InsuranceDocument,
  ): InsuranceResponseDTO {
    const { id, number, licensePlate, mark, date, file } = insurance
    return {
      id,
      number,
      licensePlate,
      mark,
      date,
      file: file && this.awsS3Service.getUrl(file),
    }
  }
}
