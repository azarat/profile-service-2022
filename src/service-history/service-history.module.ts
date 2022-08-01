import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AwsModule } from 'src/aws/aws.module'
import { CarModule } from 'src/car/car.module'
import TokenModule from 'src/token/token.module'
import { ParamMiddleware } from './param.middleware'
import {
  MaintenanceHistory,
  MaintenanceHistorySchema,
} from './schemas/maintenance-history.schema'
import {
  RefuelingHistory,
  RefuelingHistorySchema,
} from './schemas/refueling-history.schema'
import { WashHistory, WashHistorySchema } from './schemas/wash-history.schema'
import { DatabaseServiceHistoryRepository } from './service-history-db.repository'
import { ServiceHistroyController } from './service-history.controller'
import { ServiceHistoryService } from './service-history.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefuelingHistory.name, schema: RefuelingHistorySchema },
      { name: WashHistory.name, schema: WashHistorySchema },
      { name: MaintenanceHistory.name, schema: MaintenanceHistorySchema },
    ]),
    TokenModule,
    AwsModule,
    forwardRef(() => CarModule),
  ],
  providers: [ServiceHistoryService, DatabaseServiceHistoryRepository],
  controllers: [ServiceHistroyController],
  exports: [DatabaseServiceHistoryRepository],
})
export class ServiceHistoryModule implements NestModule {
  //TODO: deprecated
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ParamMiddleware).forRoutes('service-history')
  }
}
