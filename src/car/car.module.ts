import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import TokenModule from 'src/token/token.module'
import { DatabaseCarRepository } from './car-db.repository'
import { CarController } from './car.controller'
import { CarService } from './car.service'
import { Car, CarSchema } from './schemas/car.schema'
import { ServiceHistoryModule } from 'src/service-history/service-history.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    TokenModule,
    ServiceHistoryModule,
  ],
  providers: [DatabaseCarRepository, CarService],
  controllers: [CarController],
  exports: [DatabaseCarRepository],
})
export class CarModule {}
