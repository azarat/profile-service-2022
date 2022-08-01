import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import TokenModule from 'src/token/token.module'
import DatabaseService from './user-db.repository'
import { User, UserSchema } from './schemas/user.schema'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { AwsModule } from 'src/aws/aws.module'
import { OmnicellModule } from 'src/omnicell/omnicell.module'
import { DocumentsModule } from 'src/documents/documents.module'
import { CarModule } from 'src/car/car.module'
import { ServiceHistoryModule } from 'src/service-history/service-history.module'
import { InsuranceModule } from 'src/insurance/insurance.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TokenModule,
    AwsModule,
    DocumentsModule,
    CarModule,
    ServiceHistoryModule,
    InsuranceModule,
    forwardRef(() => OmnicellModule),
  ],
  providers: [UserService, DatabaseService],
  controllers: [UserController],
  exports: [UserService, DatabaseService],
})
export class UserModule {}
