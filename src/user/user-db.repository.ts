import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import UserRegistrationDTO from 'src/auth/dto/user-registration.dto'
import { AwsS3Service } from 'src/aws/aws-s3.service'
import { LocalizeError } from 'src/errors/localize.error'
import { UserStatusEnum } from './enums/status.enum'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
class DatabaseUserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  public async deleteUser(id: string): Promise<void> {
    const res = await this.userModel.findByIdAndDelete(id)
    this.validAction(res)
  }

  public async createUser(
    newUserData: UserRegistrationDTO,
    deviceToken: string,
    status: UserStatusEnum,
  ): Promise<void> {
    const { phone } = newUserData
    const user = await this.userModel.exists({ phone })
    if (!user)
      await this.userModel.create({
        ...newUserData,
        deviceToken: [deviceToken],
        status,
      })
  }

  public async updateUserById(
    updateData,
    photo?: Express.Multer.File,
  ): Promise<UserDocument> {
    const { id } = updateData
    const user = await this.userModel.findById(id)
    this.validAction(user)
    await this.userModel.findByIdAndUpdate(id, {
      ...updateData,
      photo:
        photo &&
        (await this.updateUserPhoto(
          user.photo,
          photo.buffer,
          photo.originalname,
        )),
    })
    return this.userModel.findById(id)
  }

  public async updateUserByPhone(
    phone: string,
    updateData,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOneAndUpdate({ phone }, updateData)
    this.validAction(user)
    return this.userModel.findOne({ phone })
  }

  public async findById(id: string | Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(id)
    this.validAction(user)
    return user
  }

  public async findByPhone(phone: string): Promise<UserDocument> {
    return this.userModel.findOne({ phone })
  }

  public async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email })
    this.validAction(user)
    return user
  }

  public async pushDeviceToken(
    phone: string,
    deviceToken: string,
  ): Promise<void> {
    const user = await this.findByPhone(phone)
    if (!user.deviceToken.includes(deviceToken))
      await this.userModel.findOneAndUpdate(
        { phone },
        { $push: { deviceToken } },
      )
  }

  public async deleteDeviceToken(
    userId: Types.ObjectId,
    deviceToken: string,
  ): Promise<void> {
    const user = await this.findById(userId)
    await this.userModel.findByIdAndUpdate(userId, {
      deviceToken: user.deviceToken.filter((token) => token !== deviceToken),
    })
  }

  public async deleteAvatar(userId: Types.ObjectId): Promise<void> {
    const { photo } = await this.userModel.findByIdAndUpdate(userId, {
      photo: null,
    })
    if (!photo)
      throw new LocalizeError(LocalizeError.NO_AVATAR, HttpStatus.BAD_REQUEST)
    await this.awsS3Service.deleteFile(photo)
  }

  private validAction(res): void {
    if (!res)
      throw new LocalizeError(
        LocalizeError.USER_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
  }

  private async updateUserPhoto(
    oldAvatar: string | undefined,
    buffer: Buffer,
    filename: string,
  ): Promise<string> {
    if (oldAvatar) await this.awsS3Service.deleteFile(oldAvatar)
    return this.awsS3Service.uploadFile(
      buffer,
      filename,
      process.env.AVATARS_FOLDER,
    )
  }
}

export default DatabaseUserRepository
