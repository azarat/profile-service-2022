import { Controller, Get } from '@nestjs/common'
import { ApiExcludeEndpoint } from '@nestjs/swagger'

@Controller()
export class AppController {
  @ApiExcludeEndpoint()
  @Get('health')
  health(): string {
    return 'Hello World!'
  }
}
