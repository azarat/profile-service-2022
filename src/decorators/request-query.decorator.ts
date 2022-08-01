import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common'

import { plainToClass } from 'class-transformer'
import { validateOrReject } from 'class-validator'

export const RequestQuery = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    const { query } = ctx.switchToHttp().getRequest()
    const dto = plainToClass(value, query, { excludeExtraneousValues: true })
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
