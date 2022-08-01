import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { DatabaseCarRepository } from 'src/car/car-db.repository'
import TokenService from 'src/token/token.service'

@Injectable()
export class CarUserGuard implements CanActivate {
  constructor(
    private readonly databaseCarRepository: DatabaseCarRepository,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const { token } = req.headers
    const { carId } = req.params
    const { user } = await this.tokenService.verifyToken(token)
    const car = await this.databaseCarRepository.getCar(carId)
    if (car.user.toString() === user.toString()) {
      return true
    }
    return false
  }
}
