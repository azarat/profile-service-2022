import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import axios from 'axios'
import verifyAppleToken from 'verify-apple-id-token'
import * as crypto from 'crypto'

import { IGoogleResponse } from 'src/auth/interfaces/google-response.interface'
import TokenService from 'src/token/token.service'
import DatabaseUserRepository from 'src/user/user-db.repository'
import UserTokenResponseDTO from './dto/user-token-response.dto'
import { OmnicellService } from 'src/omnicell/omnicell.service'
import { UserStatusEnum } from 'src/user/enums/status.enum'
import { UserService } from 'src/user/user.service'
import DatabaseTokenRepository from 'src/token/token-db.repository'
import PhoneLoginBodyDTO from './dto/code-login.dto'
import OmnicellVerificateDTO from './dto/omnicell-verificate.dto'
import UserRegistrationDTO from './dto/user-registration.dto'
import { SendStatusEnum } from 'src/omnicell/enums/send-sms.enum'
import { ConfigService } from '@nestjs/config'
import { IFacebookResponse } from './interfaces/facebook-response.interface'
import { LocalizeError } from 'src/errors/localize.error'

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseUserRepository: DatabaseUserRepository,
    private readonly databaseTokenRepository: DatabaseTokenRepository,
    private readonly tokenService: TokenService,
    private readonly omnicellService: OmnicellService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public async registrate(
    body: UserRegistrationDTO,
    deviceToken: string,
  ): Promise<void> {
    await this.omnicellService.sendSMS(body.phone, SendStatusEnum.REGISTRATION)
    await this.userService.createUser(body, deviceToken)
  }

  public async completeRegistation({
    code,
    phone,
  }: OmnicellVerificateDTO): Promise<UserTokenResponseDTO> {
    await this.omnicellService.omnicellVerify(code, phone)
    const user = await this.databaseUserRepository.updateUserByPhone(phone, {
      status: UserStatusEnum.ACTIVE,
    })
    const token = await this.tokenService.createJwt(user)
    return { user: this.userService.transformUserDocumentToDto(user), token }
  }

  public async phoneLogin(
    deviceToken: string,
    { code, phone }: PhoneLoginBodyDTO,
  ): Promise<UserTokenResponseDTO> {
    await this.omnicellService.omnicellVerify(code, phone)
    const userDocument = await this.databaseUserRepository.findByPhone(phone)
    if (userDocument?.status !== UserStatusEnum.ACTIVE)
      throw new LocalizeError(
        LocalizeError.COMPLETE_REGISTRATION,
        HttpStatus.UNAUTHORIZED,
      )
    await this.databaseTokenRepository.deleteTokenByUser(userDocument.id)
    await this.databaseUserRepository.pushDeviceToken(phone, deviceToken)
    const token = await this.tokenService.createJwt(userDocument)
    const user = this.userService.transformUserDocumentToDto(userDocument)
    return { user, token }
  }

  public async tokenLogin(token: string): Promise<UserTokenResponseDTO> {
    const { user: userId } = await this.tokenService.verifyToken(token)
    await this.databaseTokenRepository.deleteToken(token)
    const userDocument = await this.databaseUserRepository.findById(userId)
    const newToken = await this.tokenService.createJwt(userDocument)
    const user = this.userService.transformUserDocumentToDto(userDocument)
    return { user, token: newToken }
  }

  public async googleLogin(
    token: string,
    deviceToken: string,
  ): Promise<UserTokenResponseDTO> {
    const email = await this.getGoogleEmail(token)
    return this.authenticateByEmail(email, deviceToken)
  }

  public async facebookLogin(
    token: string,
    deviceToken: string,
  ): Promise<UserTokenResponseDTO> {
    const email = await this.getFacebookEmail(token)
    return this.authenticateByEmail(email, deviceToken)
  }

  public async appleLogin(
    idToken: string,
    nonce: string,
    deviceToken: string,
  ): Promise<UserTokenResponseDTO> {
    const email = await this.getAppleEmail(idToken, nonce)
    return this.authenticateByEmail(email, deviceToken)
  }

  public async logout(token: string, deviceToken: string): Promise<void> {
    const { user } = await this.tokenService.verifyToken(token)
    await this.databaseTokenRepository.deleteToken(token)
    await this.databaseUserRepository.deleteDeviceToken(user, deviceToken)
  }

  private async getFacebookEmail(token: string): Promise<string> {
    try {
      const {
        data: { email },
      } = await axios.get<IFacebookResponse>(
        `https://graph.facebook.com/me?fields=id,name,email,birthday&access_token=${token}`,
      )
      return email
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED)
    }
  }

  private async getGoogleEmail(token: string): Promise<string> {
    try {
      const {
        data: { email },
      } = await axios.get<IGoogleResponse>(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      )
      return email
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED)
    }
  }

  private async getAppleEmail(idToken: string, nonce: string): Promise<string> {
    try {
      const { email } = await verifyAppleToken({
        idToken,
        nonce: crypto.createHash('sha256').update(nonce).digest('hex'),
        clientId: await this.configService.get('appleClientId'),
      })
      return email
    } catch (error) {
      throw new HttpException(
        'Invalid id token or nonce',
        HttpStatus.UNAUTHORIZED,
      )
    }
  }

  private async authenticateByEmail(
    email: string,
    deviceToken: string,
  ): Promise<UserTokenResponseDTO> {
    const userDocument = await this.databaseUserRepository.findByEmail(email)
    if (userDocument.status !== UserStatusEnum.ACTIVE)
      throw new LocalizeError(
        LocalizeError.COMPLETE_REGISTRATION,
        HttpStatus.UNAUTHORIZED,
      )
    await this.databaseTokenRepository.deleteTokenByUser(userDocument.id)
    const jwtToken = await this.tokenService.createJwt(userDocument)
    await this.databaseUserRepository.pushDeviceToken(
      userDocument.phone,
      deviceToken,
    )
    const user = this.userService.transformUserDocumentToDto(userDocument)
    return { user, token: jwtToken }
  }
}
