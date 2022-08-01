import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { CreateCarDTO } from './dto/create-car.dto'
import { UpdateCarDTO } from './dto/update-car.dto'
import { Car, CarDocument } from './schemas/car.schema'

@Injectable()
export class DatabaseCarRepository {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
  ) {}

  public async createCar(
    body: CreateCarDTO,
    user: Types.ObjectId,
  ): Promise<CarDocument> {
    return this.carModel.create({ ...body, user })
  }

  public async updateCar(id: string, body: UpdateCarDTO): Promise<CarDocument> {
    const car = await this.carModel.findByIdAndUpdate(id, body)
    this.validAction(car)
    return this.carModel.findById(id)
  }

  public async deleteCar(id: string): Promise<void> {
    const res = await this.carModel.findByIdAndDelete(id)
    this.validAction(res)
  }

  public async updateOwner(
    id: string,
    user: Types.ObjectId,
  ): Promise<CarDocument> {
    const car = await this.carModel.findByIdAndUpdate(id, { user })
    this.validAction(car)
    return this.carModel.findById(id)
  }

  public async getCars(user: Types.ObjectId): Promise<CarDocument[]> {
    return this.carModel.find({ user })
  }

  public async getCar(id: string): Promise<CarDocument> {
    const car = await this.carModel.findById(id)
    this.validAction(car)
    return car
  }

  public async setMileage(car: Types.ObjectId, mileage: number): Promise<void> {
    await this.carModel.findByIdAndUpdate(car, { mileage })
  }

  private validAction(res): void {
    if (!res)
      throw new HttpException(
        `Car with this id doesn't exist`,
        HttpStatus.BAD_REQUEST,
      )
  }
}
