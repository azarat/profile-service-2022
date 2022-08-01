import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

import TokenService from 'src/token/token.service'
import { DatabaseCarRepository } from 'src/car/car-db.repository'
import { Types } from 'mongoose'

@Injectable()
export class ParamMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenService: TokenService,
    private readonly databaseCarRepository: DatabaseCarRepository,
  ) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const param = req.originalUrl.split('/').reverse()[0]

    const { token } = req.headers
    ;(req as any).carId = Types.ObjectId.isValid(param)
      ? param
      : await this.getCarId(token as string)
    next()
  }

  private async getCarId(token: string): Promise<string> {
    const { user } = await this.tokenService.verifyToken(token as string)
    const cars = await this.databaseCarRepository.getCars(user)
    return cars[0]._id
  }
}
