import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common'

import { plainToClass } from 'class-transformer'
import { validateOrReject } from 'class-validator'

export const RequestHeader = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    const { headers } = ctx.switchToHttp().getRequest()
    const dto = plainToClass(value, headers, { excludeExtraneousValues: true })
    return validateOrReject(dto).then(
      () => {
        return dto
      },
      (err) => {
        throw new HttpException(err, HttpStatus.UNAUTHORIZED)
      },
    )
  },
)
