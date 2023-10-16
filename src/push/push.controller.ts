import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    HttpCode,
    Patch,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    HttpException,
    HttpStatus,
} from '@nestjs/common'

import {
    ApiConsumes,
    ApiExcludeEndpoint,
    ApiHeader,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { PushService } from './push.service'
import PushByUserPhoneDTO from './dto/push.dto'
import { PushGuard } from 'src/auth/guards/push.guard'
  
@Controller('push')
@ApiTags('Push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @UseGuards(PushGuard)
  @Post('ByPhone')
  @HttpCode(200)
  public async pushUserByPhone(
    @Body() reqBody: PushByUserPhoneDTO,
  ): Promise<boolean> {
    const { phone, title, body } = reqBody

    await this.pushService.pushUserByPhone(phone, title, body)

    return true
  }
}