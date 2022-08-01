import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common'
import { Types } from 'mongoose'

import { DatabaseServiceHistoryRepository } from 'src/service-history/service-history-db.repository'
import TokenService from 'src/token/token.service'
import { DatabaseCarRepository } from 'src/car/car-db.repository'
import { RefuelingHistoryDocument } from 'src/service-history/schemas/refueling-history.schema'
import { MaintenanceHistoryDocument } from 'src/service-history/schemas/maintenance-history.schema'
import { WashHistoryDocument } from 'src/service-history/schemas/wash-history.schema'

export const ServiceHistoryGuard = (type: string): Type<CanActivate> => {
  @Injectable()
  class ServiceHistoryGuardMixin implements CanActivate {
    constructor(
      private readonly databaseServiceHistoryRepository: DatabaseServiceHistoryRepository,
      private readonly databaseCarRepository: DatabaseCarRepository,
      private readonly tokenService: TokenService,
    ) {}

    private async getServiceHistory(
      id: string,
    ): Promise<
      | RefuelingHistoryDocument
      | WashHistoryDocument
      | MaintenanceHistoryDocument
    > {
      const ServiceHistoryTypes = {
        refuelingHistory:
          this.databaseServiceHistoryRepository.getRefuelingHistory,
        washHistory: this.databaseServiceHistoryRepository.getWashHistory,
        maintenanceHistory:
          this.databaseServiceHistoryRepository.getMaintenanceHistory,
      }
      return ServiceHistoryTypes[type].call(
        this.databaseServiceHistoryRepository,
        id,
      )
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest()
      const { token } = req.headers
      const { id } = req.params

      if (!Types.ObjectId.isValid(id))
        throw new HttpException('Enter valid id', HttpStatus.BAD_REQUEST)
      const { user } = await this.tokenService.verifyToken(token)
      const record = await this.getServiceHistory(id)
      const car = await this.databaseCarRepository.getCar(record.car.toString())

      if (car.user.toString() == user.toString()) {
        return true
      }
      return false
    }
  }
  return mixin(ServiceHistoryGuardMixin)
}
