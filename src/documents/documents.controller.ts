import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiExcludeEndpoint,
  ApiHeader,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { RequestHeader } from 'src/decorators/request-header.decorator'
import TokenHeaderDTO from 'src/common-dto/token-header.dto'
import { DatabaseDocumentsRepository } from './documents-db.repository'
import { DocumentsService } from './documents.service'
import { CreateDriverLicenseDTO } from './dto/driver-license/create-driver-license.dto'
import { ResponseDriverLicenseDTO } from './dto/driver-license/response-driver-license.dto'
import { UpdateDriverLicenseDTO } from './dto/driver-license/update-driver-license.dto'
import { CreateINNDTO } from './dto/inn/create-inn.dto'
import { ResponseINNDTO } from './dto/inn/response-inn.dto'
import { UpdateINNDTO } from './dto/inn/update-inn.dto'
import { CreateTechnicalPassportDTO } from './dto/technical-passport/create-technical-passport.dto'
import { ResponseTechnicalPassportDTO } from './dto/technical-passport/response-technical-passport.dto'
import { UpdateTechnicalPassportDTO } from './dto/technical-passport/update-technical-passport.dto'
import { RequestParam } from 'src/decorators/request-params.decorator'
import { IdParamDTO } from '../common-dto/id-param.dto'
import { DocumentUserGuard } from 'src/auth/guards/document-user.guard'
import { UserSdkGuard } from 'src/auth/guards/user-sdk.guard'

@Controller('documents')
@ApiTags('Documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly databaseDocumentsRepository: DatabaseDocumentsRepository,
  ) {}

  @Get()
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    type: [ResponseDriverLicenseDTO],
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public getDocuments(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
  ): Promise<
    (ResponseDriverLicenseDTO | ResponseINNDTO | ResponseTechnicalPassportDTO)[]
  > {
    return this.documentsService.getDocuments(token)
  }

  @UseGuards(DocumentUserGuard('driverLicense'))
  @Get('driver-license/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    type: ResponseDriverLicenseDTO,
  })
  @ApiResponse({
    status: 400,
    description: `Record with this id doesn't exist`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'This document is not yours',
  })
  public getDriverLicense(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<ResponseDriverLicenseDTO> {
    return this.documentsService.getDriverLicense(id)
  }

  @UseGuards(DocumentUserGuard('inn'))
  @Get('inn/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    type: ResponseINNDTO,
  })
  @ApiResponse({
    status: 400,
    description: `Record with this id doesn't exist`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'This document is not yours',
  })
  public getInn(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<ResponseINNDTO> {
    return this.documentsService.getInn(id)
  }

  @UseGuards(DocumentUserGuard('technicalPassport'))
  @Get('technical-passport/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    type: ResponseINNDTO,
  })
  @ApiResponse({
    status: 400,
    description: `Record with this id doesn't exist`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'This document is not yours',
  })
  public getTechnicalPassport(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<ResponseTechnicalPassportDTO> {
    return this.documentsService.getTechnicalPassport(id)
  }

  @Post('driver-license')
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'Driver license was successfully added',
    type: ResponseDriverLicenseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 409,
    description: 'You can add only 4 documents',
  })
  public createDriverLicense(
    @Body() license: CreateDriverLicenseDTO,
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
  ): Promise<ResponseDriverLicenseDTO> {
    return this.documentsService.createDriverLicense(license, token)
  }

  @Post('inn')
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'INN was successfully added',
    type: ResponseINNDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 409,
    description: 'You can add only 4 documents',
  })
  public createINN(
    @Body() inn: CreateINNDTO,
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
  ): Promise<ResponseINNDTO> {
    return this.documentsService.createINN(inn, token)
  }

  @Post('technical-passport')
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'INN was successfully added',
    type: ResponseTechnicalPassportDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 409,
    description: 'You can add only 4 documents',
  })
  public createTechnicalPassport(
    @Body() technicalPassport: CreateTechnicalPassportDTO,
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
  ): Promise<ResponseTechnicalPassportDTO> {
    return this.documentsService.createTechnicalPassport(
      technicalPassport,
      token,
    )
  }

  @UseGuards(DocumentUserGuard('driverLicense'))
  @Patch('driver-license/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Driver license was successfully updated',
    type: ResponseTechnicalPassportDTO,
  })
  @ApiResponse({
    status: 400,
    description: `Record with this id doesn't exist`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'This document is not yours',
  })
  public updateDriverLicense(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
    @Body() license: UpdateDriverLicenseDTO,
  ): Promise<ResponseDriverLicenseDTO> {
    return this.documentsService.updateDriverLicense(id, license)
  }

  @UseGuards(DocumentUserGuard('inn'))
  @Patch('inn/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'INN was successfully updated',
    type: ResponseINNDTO,
  })
  @ApiResponse({
    status: 400,
    description: `Record with this id doesn't exist`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'This document is not yours',
  })
  public updateINN(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
    @Body() inn: UpdateINNDTO,
  ): Promise<ResponseINNDTO> {
    return this.documentsService.updateINN(id, inn)
  }

  @UseGuards(DocumentUserGuard('technicalPassport'))
  @Patch('technical-passport/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Technical passport was successfully updated',
    type: ResponseTechnicalPassportDTO,
  })
  @ApiResponse({
    status: 400,
    description: `Record with this id doesn't exist`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'This document is not yours',
  })
  public updateTechnicalPassport(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
    @Body() passport: UpdateTechnicalPassportDTO,
  ): Promise<ResponseTechnicalPassportDTO> {
    return this.documentsService.updateTechnicalPassport(id, passport)
  }

  @UseGuards(DocumentUserGuard('driverLicense'))
  @Delete('driver-license/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Driver license was successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: `Record with this id doesn't exist`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'This document is not yours',
  })
  public deleteDriverLicense(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<void> {
    return this.databaseDocumentsRepository.deleteDriverLicense(id)
  }
  @UseGuards(DocumentUserGuard('inn'))
  @Delete('inn/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'INN was successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: `Record with this id doesn't exist`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'This document is not yours',
  })
  public deleteINN(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<void> {
    return this.databaseDocumentsRepository.deleteINN(id)
  }

  @UseGuards(DocumentUserGuard('technicalPassport'))
  @Delete('technical-passport/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Technical passport license was successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: `Record with this id doesn't exist`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'This document is not yours',
  })
  public deleteTechnicalPassport(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<void> {
    return this.databaseDocumentsRepository.deleteTechnicalPassport(id)
  }

  @UseGuards(UserSdkGuard)
  @Get('sdk')
  @ApiExcludeEndpoint()
  public getDocumentsSdk(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
  ): Promise<
    (ResponseDriverLicenseDTO | ResponseINNDTO | ResponseTechnicalPassportDTO)[]
  > {
    return this.documentsService.getDocuments(token)
  }
}
