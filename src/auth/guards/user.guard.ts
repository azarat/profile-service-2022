import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { Types } from 'mongoose'

import TokenService from 'src/token/token.service'
import DatabaseUserRepository from 'src/user/user-db.repository'

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly databaseUserRepository: DatabaseUserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const { token } = req.headers
    const { id } = req.params
    if (!Types.ObjectId.isValid(id))
      throw new HttpException('Enter valid id', HttpStatus.BAD_REQUEST)
    const { user: userId } = await this.tokenService.verifyToken(token)
    const user = await this.databaseUserRepository.findById(id)

    if (user.id.toString() == userId.toString()) {
      return true
    }
    return false
  }
}
