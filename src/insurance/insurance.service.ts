import { Injectable } from '@nestjs/common'
import { Types } from 'mongoose'

import { DatabaseInsuranceRepository } from './insurance-db.repository'
import InsuranceResponseDTO from './dto/insurance-response.dto'
import CreateInsuranceDTO from './dto/create-insurance.dto'
import TokenService from 'src/token/token.service'
import { InsuranceDocument } from './schemas/insurance.schema'
import { AwsS3Service } from 'src/aws/aws-s3.service'
import UpdateInsuranceDTO from './dto/update-insurance.dto'

@Injectable()
export class InsuranceService {
  constructor(
    private readonly databaseInsuranceRepository: DatabaseInsuranceRepository,
    private readonly awsS3Service: AwsS3Service,
    private readonly tokenService: TokenService,
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
