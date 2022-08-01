import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { CarModule } from 'src/car/car.module'
import { ParamMiddleware } from 'src/service-history/param.middleware'
import { ServiceHistoryModule } from 'src/service-history/service-history.module'
import TokenModule from 'src/token/token.module'

import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
  imports: [TokenModule, ServiceHistoryModule, CarModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ParamMiddleware).forRoutes('statistics')
  }
}
