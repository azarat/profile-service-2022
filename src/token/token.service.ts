import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Types } from 'mongoose'

import { UserDocument } from 'src/user/schemas/user.schema'
import { IVerifyToken } from './interfaces/token.interfaces'
import DatabaseTokenRepository from './token-db.repository'

@Injectable()
class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly databaseTokenRepository: DatabaseTokenRepository,
  ) { }

  public async createJwt(user: UserDocument): Promise<string> {
    const token = await this.jwtService.signAsync(
      { user: user._id },
      { secret: await this.configService.get('jwtSecret') },
    )
    await this.databaseTokenRepository.createRecord(user, token)
    return token
  }

  public async verifyToken(token: string): Promise<IVerifyToken> {
    if (!(await this.databaseTokenRepository.getUserByToken(token)))
      throw new HttpException(
        `This token doesn't exist`,
        HttpStatus.BAD_REQUEST,
      )
    try {
      const { user } = await this.jwtService.verifyAsync(token, {
        secret: await this.configService.get('jwtSecret'),
      })
      return { user: new Types.ObjectId(user) }
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED)
    }
  }

  public async createCarJwt(car: string): Promise<string> {
    return this.jwtService.signAsync(
      { car },
      { secret: await this.configService.get('jwtSecret') },
    )
  }

  public async verifyCarJwt(token: string): Promise<string> {
    const { car } = await this.jwtService.verifyAsync(token, {
      secret: await this.configService.get('jwtSecret'),
    })
    return car
  }
}

export default TokenService
