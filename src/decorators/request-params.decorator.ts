import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common'

import { plainToClass } from 'class-transformer'
import { validateOrReject } from 'class-validator'

export const RequestParam = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    const { params } = ctx.switchToHttp().getRequest()
    const dto = plainToClass(value, params, { excludeExtraneousValues: true })
    return validateOrReject(dto).then(
      () => {
        return dto
      },
      (err) => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST)
      },
    )
  },
)
