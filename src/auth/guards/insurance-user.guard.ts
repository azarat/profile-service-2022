import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Types } from 'mongoose'

import { DatabaseInsuranceRepository } from 'src/insurance/insurance-db.repository'
import TokenService from 'src/token/token.service'

@Injectable()
export class InsuranceUserGuard implements CanActivate {
  constructor(
    private readonly databaseInsuranceRepository: DatabaseInsuranceRepository,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const { token } = req.headers
    const { id } = req.params
    if (!Types.ObjectId.isValid(id))
      throw new HttpException('Enter valid id', HttpStatus.BAD_REQUEST)

    const { user } = await this.tokenService.verifyToken(token)
    const insurance = await this.databaseInsuranceRepository.findById(id)

    if (insurance.user.toString() === user.toString()) {
      return true
    }
    return false
  }
}
