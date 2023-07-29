import { Injectable } from '@nestjs/common'
import { DatabaseServiceHistoryRepository } from 'src/service-history/service-history-db.repository'

import TokenService from 'src/token/token.service'
import { DatabaseCarRepository } from './car-db.repository'
import { CarResponseDTO } from './dto/car-response.dto'
import { CreateCarDTO } from './dto/create-car.dto'
import { UpdateCarDTO } from './dto/update-car.dto'
import { CarDocument } from './schemas/car.schema'

@Injectable()
export class CarService {
  static readonly DEFAULT_PLATE_FORMAT = 'y2015'

  constructor(
    private readonly databaseCarRepository: DatabaseCarRepository,
    private readonly tokenService: TokenService,
    private readonly databaseServiceHistoryRepository: DatabaseServiceHistoryRepository,
  ) {}

  public async createCar(
    body: CreateCarDTO,
    token: string,
  ): Promise<CarResponseDTO> {
    const { user } = await this.tokenService.verifyToken(token)
    const newCar = await this.databaseCarRepository.createCar(body, user)
    return this.transformCarDocumentToDto(newCar)
  }

  public async getCars(token: string): Promise<CarResponseDTO[]> {
    const { user } = await this.tokenService.verifyToken(token)
    const cars = await this.databaseCarRepository.getCars(user)
    return cars.map((car) => this.transformCarDocumentToDto(car))
  }

  public async updateCar(
    id: string,
    body: UpdateCarDTO,
  ): Promise<CarResponseDTO> {
    const car = await this.databaseCarRepository.updateCar(id, body)
    return this.transformCarDocumentToDto(car)
  }

  public async deleteCar(id: string): Promise<void> {
    await this.databaseCarRepository.deleteCar(id)
    await this.databaseServiceHistoryRepository.deleteHistoriesByCar(id)
  }

  public createCarTransfer(carId: string): Promise<string> {
    return this.tokenService.createCarJwt(carId)
  }

  public async completeCarTransfer(
    token: string,
    qrToken: string,
  ): Promise<CarResponseDTO> {
    const { user } = await this.tokenService.verifyToken(token)
    const car = await this.tokenService.verifyCarJwt(qrToken)
    const updatedCar = await this.databaseCarRepository.updateOwner(car, user)
    return this.transformCarDocumentToDto(updatedCar)
  }

  private transformCarDocumentToDto(car: CarDocument): CarResponseDTO {
    const {
      id,
      year,
      mark,
      model,
      generation,
      modelType,
      modification,
      bodyType,
      mileage,
      vin,
      licensePlate,
      plateFormat,
    } = car
    return {
      id,
      year,
      mark,
      model,
      generation,
      modelType,
      modification,
      bodyType,
      mileage,
      vin,
      licensePlate,
      plateFormat: plateFormat || CarService.DEFAULT_PLATE_FORMAT,
    }
  }
}
