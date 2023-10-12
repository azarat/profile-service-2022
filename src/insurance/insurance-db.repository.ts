import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import CreateInsuranceDTO from './dto/create-insurance.dto'
import { AwsS3Service } from 'src/aws/aws-s3.service'
import { Insurance, InsuranceDocument } from './schemas/insurance.schema'
import UpdateInsuranceDTO from './dto/update-insurance.dto'

@Injectable()
export class DatabaseInsuranceRepository {
  constructor(
    @InjectModel(Insurance.name)
    private readonly insuranceModel: Model<InsuranceDocument>,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  public async deleteInsurancesByUser(userId: Types.ObjectId): Promise<void> {
    await this.insuranceModel.deleteMany({ user: userId })
  }

  public async createInsurance(
    user: Types.ObjectId,
    body: CreateInsuranceDTO,
    file: Express.Multer.File,
  ): Promise<InsuranceDocument> {
    const uniqueFileName = await this.uploadInsuranceFile(
      undefined,
      file.buffer,
      file.originalname,
    )
    return this.insuranceModel.create({ user, ...body, file: uniqueFileName })
  }

  public async getInsurances(
    user: Types.ObjectId,
  ): Promise<InsuranceDocument[]> {
    return this.insuranceModel.find({ user })
  }

  public async getExpireInsurances(daysToExpire: number): Promise<InsuranceDocument[]> {
    return this.insuranceModel.aggregate([
      {
        $addFields: {
          dayssince: {
            $ceil: {
              $divide: [{ $subtract: ['$date', new Date()] }, 1000 * 60 * 60 * 24]
            }
          }
        }
      },
      {
        $match: {
          dayssince: daysToExpire
        }
      }
    ])
  }

  public async findById(
    id: string | Types.ObjectId,
  ): Promise<InsuranceDocument> {
    const insurance = await this.insuranceModel.findById(id)
    this.validAction(insurance)
    return insurance
  }

  public async deleteInsurance(id: string): Promise<void> {
    const res = await this.insuranceModel.findByIdAndDelete(id)
    this.validAction(res)
  }

  public async updateInsuranceById(
    id: string,
    body: UpdateInsuranceDTO,
    file: Express.Multer.File,
  ): Promise<InsuranceDocument> {
    const insurance = await this.insuranceModel.findById(id)
    this.validAction(insurance)
    await this.insuranceModel.findByIdAndUpdate(id, {
      ...body,
      file:
        file &&
        (await this.uploadInsuranceFile(
          insurance.file,
          file.buffer,
          file.originalname,
        )),
    })
    return this.insuranceModel.findById(id)
  }

  private async uploadInsuranceFile(
    oldFile: string | undefined,
    buffer: Buffer,
    filename: string,
  ): Promise<string> {
    if (oldFile) await this.awsS3Service.deleteFile(oldFile)
    return this.awsS3Service.uploadFile(
      buffer,
      filename,
      process.env.INSURANCE_FOLDER,
    )
  }

  private validAction(res): void {
    if (!res)
      throw new HttpException(
        `Insurance with this id doesn't exist`,
        HttpStatus.BAD_REQUEST,
      )
  }
}
