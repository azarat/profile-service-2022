import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { configuration } from './config/configuration'
import { CarModule } from './car/car.module'
import { DocumentsModule } from './documents/documents.module'
import { ServiceHistoryModule } from './service-history/service-history.module'
import { StatisticsModule } from './statistics/statistics.module'
import { InsuranceModule } from './insurance/insurance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        const { mongoUri: uri } = await configuration()
        return {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      },
    }),
    AuthModule,
    UserModule,
    CarModule,
    DocumentsModule,
    ServiceHistoryModule,
    StatisticsModule,
    InsuranceModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
