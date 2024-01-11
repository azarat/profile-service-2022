import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import TokenModule from 'src/token/token.module'
import { DatabaseInsuranceRepository } from './insurance-db.repository'
import { InsuranceController } from './insurance.controller'
import { InsuranceService } from './insurance.service'
import { Insurance, InsuranceSchema } from './schemas/insurance.schema'
import { AwsModule } from 'src/aws/aws.module'
import { ServiceHistoryModule } from 'src/service-history/service-history.module'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Insurance.name, schema: InsuranceSchema },
    ]),
    TokenModule,
    ServiceHistoryModule,
    AwsModule,
    forwardRef(() => UserModule),
  ],
  controllers: [InsuranceController],
  providers: [InsuranceService, DatabaseInsuranceRepository],
  exports: [InsuranceService],
})
export class InsuranceModule {}
