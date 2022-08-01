import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { RequestHeader } from '../decorators/request-header.decorator'
import TokenHeaderDTO from '../common-dto/token-header.dto'
import OmnicellVerificateDTO from './dto/omnicell-verificate.dto'
import UserRegistrationDTO from './dto/user-registration.dto'
import UserTokenResponseDTO from './dto/user-token-response.dto'
import PhoneLoginBodyDTO from './dto/code-login.dto'
import { DeviceTokenHeaderDTO } from './dto/device-token-header.dto'
import { LogoutHeaderDTO } from './dto/logout-headers.dto'
import { AppleLoginDTO } from './dto/apple-login.dto'
import SendSMSBodyDTO from '../omnicell/dto/send-sms.dto'
import { SendStatusEnum } from 'src/omnicell/enums/send-sms.enum'
import { OmnicellService } from 'src/omnicell/omnicell.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly omnicellService: OmnicellService,
  ) {}

  //TODO: Deprecated
  @Post('send-sms')
  @HttpCode(200)
  @ApiTags('Login')
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Sms was sent',
  })
  @ApiResponse({
    status: 400,
    description: `Invalid phone or User with this phone doesn't exist`,
  })
  public sendSMS(@Body() { phone }: SendSMSBodyDTO): Promise<void> {
    return this.omnicellService.sendSMS(phone, SendStatusEnum.LOGIN)
  }

  @Post('registration')
  @HttpCode(200)
  @ApiTags('Registration')
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiHeader({
    name: 'devicetoken',
  })
  @ApiResponse({
    status: 200,
    description: 'SMS was sent',
  })
  @ApiResponse({ status: 400, description: 'Invalid phone' })
  @ApiResponse({
    status: 409,
    description: 'User with this phone already exists',
  })
  public async registrate(
    @RequestHeader(DeviceTokenHeaderDTO) { devicetoken }: DeviceTokenHeaderDTO,
    @Body() body: UserRegistrationDTO,
  ): Promise<void> {
    return this.authService.registrate(body, devicetoken)
  }

  @Patch('complete-registration')
  @ApiTags('Registration')
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'User was successfully created',
    type: UserTokenResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: `User with this phone doesn't exist`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid phone or code',
  })
  public completeRegistation(
    @Body() body: OmnicellVerificateDTO,
  ): Promise<UserTokenResponseDTO> {
    return this.authService.completeRegistation(body)
  }

  @Post('phone-login')
  @HttpCode(200)
  @ApiTags('Login')
  @ApiHeader({
    name: 'deviceToken',
  })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Loged in successfully',
    type: UserTokenResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid phone or code or User status is not active yet',
  })
  public phoneLogin(
    @RequestHeader(DeviceTokenHeaderDTO) { devicetoken }: DeviceTokenHeaderDTO,
    @Body()
    body: PhoneLoginBodyDTO,
  ): Promise<UserTokenResponseDTO> {
    return this.authService.phoneLogin(devicetoken, body)
  }

  @Get('token-login')
  @ApiTags('Login')
  @ApiHeader({
    name: 'token',
  })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Loged in successfully',
    type: UserTokenResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: `This token doesn't exist`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public tokenLogin(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
  ): Promise<UserTokenResponseDTO> {
    return this.authService.tokenLogin(token)
  }

  @Get('google-login')
  @ApiTags('Login')
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'devicetoken',
  })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Loged in successfully',
    type: UserTokenResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token or User status is not active yet',
  })
  public googleLogin(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
    @RequestHeader(DeviceTokenHeaderDTO) { devicetoken }: DeviceTokenHeaderDTO,
  ): Promise<UserTokenResponseDTO> {
    return this.authService.googleLogin(token, devicetoken)
  }

  @Get('facebook-login')
  @ApiTags('Login')
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'devicetoken',
  })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Loged in successfully',
    type: UserTokenResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token or User status is not active yet',
  })
  public facebookLogin(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
    @RequestHeader(DeviceTokenHeaderDTO) { devicetoken }: DeviceTokenHeaderDTO,
  ): Promise<UserTokenResponseDTO> {
    return this.authService.facebookLogin(token, devicetoken)
  }

  @Post('apple-login')
  @HttpCode(200)
  @ApiTags('Login')
  @ApiHeader({
    name: 'devicetoken',
  })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Loged in successfully',
    type: UserTokenResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token or User status is not active yet',
  })
  public appleLogin(
    @RequestHeader(DeviceTokenHeaderDTO) { devicetoken }: DeviceTokenHeaderDTO,
    @Body() { idToken, nonce }: AppleLoginDTO,
  ): Promise<UserTokenResponseDTO> {
    return this.authService.appleLogin(idToken, nonce, devicetoken)
  }

  @Delete('logout')
  @ApiTags('Logout')
  @HttpCode(204)
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'devicetoken',
  })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 204,
    description: 'Log out successfully',
  })
  @ApiResponse({
    status: 400,
    description: `This token doesn't exist`,
  })
  public logout(
    @RequestHeader(LogoutHeaderDTO) { token, devicetoken }: LogoutHeaderDTO,
  ): Promise<void> {
    return this.authService.logout(token, devicetoken)
  }
}
