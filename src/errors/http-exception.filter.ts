import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { Request, Response } from 'express'

import { LanguagesEnum } from './languages.enum'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const { headers } = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const acceptLanguage = headers['accept-language']
    const language = Object.keys(LanguagesEnum).includes(acceptLanguage)
      ? acceptLanguage
      : LanguagesEnum.uk
    const errorMessage = exception.getResponse()
    const message =
      typeof errorMessage === 'string'
        ? errorMessage
        : this.getErrorMessage(errorMessage, language)

    response.status(status).json({
      statusCode: status,
      message,
    })
  }

  private getErrorMessage(err, language: string): Record<string, any> {
    if (err[language]) {
      return err[language]
    }
    return err
  }
}
