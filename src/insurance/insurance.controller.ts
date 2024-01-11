import {
  Controller,
  Body,
  Post,
  Get,
  UseInterceptors,
  UsePipes,
  UploadedFile,
  HttpCode,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiHeader, ApiResponse, ApiConsumes, ApiParam } from '@nestjs/swagger'

import { InsuranceService } from './insurance.service'
import { RequestHeader } from 'src/decorators/request-header.decorator'
import CreateInsuranceDTO from './dto/create-insurance.dto'
import InsuranceResponseDTO from './dto/insurance-response.dto'
import { InsuranceValidationPipe } from '../validation/insuranceValidation'
import TokenHeaderDTO from 'src/common-dto/token-header.dto'
import { IdParamDTO } from 'src/common-dto/id-param.dto'
import { RequestParam } from 'src/decorators/request-params.decorator'
import { InsuranceUserGuard } from 'src/auth/guards/insurance-user.guard'
import { InsuranceParamDTO } from 'src/common-dto/insurance-param.dto'
import UpdateInsuranceDTO from './dto/update-insurance.dto'

@Controller('insurance')
@ApiTags('Insurance')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new InsuranceValidationPipe())
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'Insurance was successfully added',
    type: InsuranceResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public createInsurance(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
    @Body() body: CreateInsuranceDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<InsuranceResponseDTO> {
    return this.insuranceService.createInsurance(token, body, file)
  }

  @Get()
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'insurances',
    type: [InsuranceResponseDTO],
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public getInsurances(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
  ): Promise<InsuranceResponseDTO[]> {
    return this.insuranceService.getInsurances(token)
  }

  @Get('cron')
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Sending push 10 days prior policy ends up',
    type: Boolean,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public sendWarnPush(): Promise<boolean> {
    return this.insuranceService.sendWarnPush()
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'insurance',
    type: [InsuranceResponseDTO],
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public getById(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<InsuranceResponseDTO> {
    return this.insuranceService.getById(token, id)
  }

  @UseGuards(InsuranceUserGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 204,
    description: 'Insurance was deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: `Insurance with this id doesn't exist`,
  })
  @ApiResponse({
    status: 403,
    description: 'This insurance is not yours',
  })
  public deleteInsurance(
    @RequestParam(InsuranceParamDTO) { id }: InsuranceParamDTO,
  ): Promise<void> {
    return this.insuranceService.deleteInsurance(id)
  }

  @UseGuards(InsuranceUserGuard)
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new InsuranceValidationPipe())
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Insurance was succesfully updated',
    type: InsuranceResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: `Insurance with this id doesn't exist or problem with file uploading(format, size)`,
  })
  @ApiResponse({
    status: 403,
    description: `This token doesn't belong you`,
  })
  @ApiResponse({
    status: 409,
    description: `This insurance is not yours`,
  })
  public async updateInsurance(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
    @Body() body: UpdateInsuranceDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<InsuranceResponseDTO> {
    return this.insuranceService.updateInsurance(id, body, file)
  }
}
