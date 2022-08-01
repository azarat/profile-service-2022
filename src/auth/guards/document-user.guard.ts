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

import { DatabaseDocumentsRepository } from 'src/documents/documents-db.repository'
import { DriverLicenseDocument } from 'src/documents/schemas/driver-license.schema'
import { INNDocument } from 'src/documents/schemas/inn.schema'
import { TechnicalPassportDocument } from 'src/documents/schemas/technical-passport.schema'
import TokenService from 'src/token/token.service'

export const DocumentUserGuard = (type: string): Type<CanActivate> => {
  @Injectable()
  class DocumentUserGuardMixin implements CanActivate {
    constructor(
      private readonly databaseDocumentsRepository: DatabaseDocumentsRepository,
      private readonly tokenService: TokenService,
    ) {}

    private async getDocument(
      id: string,
    ): Promise<
      DriverLicenseDocument | INNDocument | TechnicalPassportDocument
    > {
      const documentTypes = {
        driverLicense: this.databaseDocumentsRepository.getDriverLicene,
        inn: this.databaseDocumentsRepository.getInn,
        technicalPassport:
          this.databaseDocumentsRepository.getTechnicalPassport,
      }
      return documentTypes[type].call(this.databaseDocumentsRepository, id)
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest()
      const { token } = req.headers
      const { id } = req.params

      if (!Types.ObjectId.isValid(id))
        throw new HttpException('Enter valid id', HttpStatus.BAD_REQUEST)
      const { user } = await this.tokenService.verifyToken(token)
      const document = await this.getDocument(id)

      if (document.user.toString() == user.toString()) {
        return true
      }
      return false
    }
  }
  return mixin(DocumentUserGuardMixin)
}
