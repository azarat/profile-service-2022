import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import TokenModule from 'src/token/token.module'
import { DatabaseDocumentsRepository } from './documents-db.repository'
import { DocumentsController } from './documents.controller'
import { DocumentsService } from './documents.service'
import {
  DriverLicense,
  DriverLicenseSchema,
} from './schemas/driver-license.schema'
import { INN, INNSchema } from './schemas/inn.schema'
import {
  TechnicalPassport,
  TechnicalPassportSchema,
} from './schemas/technical-passport.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DriverLicense.name, schema: DriverLicenseSchema },
      { name: INN.name, schema: INNSchema },
      { name: TechnicalPassport.name, schema: TechnicalPassportSchema },
    ]),
    TokenModule,
  ],
  providers: [DatabaseDocumentsRepository, DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}
