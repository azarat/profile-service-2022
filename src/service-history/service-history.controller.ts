import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import {
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger'
import { CarUserGuard } from 'src/auth/guards/car-user.guard'

import { ServiceHistoryGuard } from 'src/auth/guards/service-history.guard'
import { CarParamDTO } from 'src/common-dto/car-param.dto'
import { IdParamDTO } from 'src/common-dto/id-param.dto'
import { RequestParam } from 'src/decorators/request-params.decorator'
import { RequestQuery } from 'src/decorators/request-query.decorator'
import { PhotoValidationPipe } from 'src/validation/photoValidation'
import { YearParamDTO } from 'src/common-dto/year-param.dto'
import { ResponseMonthlyHistoryDTO } from './dto/response-monthly-history.dto'
import { CreateMaintenanceHistoryDTO } from './dto/maintenance-history/create-maintenance-history.dto'
import { ResponseMaintenanceHistoryDTO } from './dto/maintenance-history/response-maintenance-history.dto'
import { UpdateMaintenanceHistoryDTO } from './dto/maintenance-history/update-maintenance-history.dto'
import { CreateRefuelingHistoryDTO } from './dto/refueling-history/create-refueling-history.dto'
import { ResponseRefuelingHistoryDTO } from './dto/refueling-history/response-refueling-history.dto'
import { ResponseMonthlyRefuelingHistoryDTO } from './dto/refueling-history/response-monthly-refueling-history.dto'
import { UpdateRefuelingHistoryDTO } from './dto/refueling-history/update-refueling-history.dto'
import { AllRecordsResponseDTO } from './dto/service-history.response'
import { CreateWashHistoryDTO } from './dto/wash-history/create-wash-history.dto'
import { ResponseWashHistoryDTO } from './dto/wash-history/response-wash-history.dto'
import { UpdateWashHistoryDTO } from './dto/wash-history/update-wash-history.dto'
import { ServiceHistoryTypeEnum } from './enums/maintenance.enum'
import { DatabaseServiceHistoryRepository } from './service-history-db.repository'
import { ServiceHistoryService } from './service-history.service'
import TokenHeaderDTO from 'src/common-dto/token-header.dto'
import { RequestHeader } from 'src/decorators/request-header.decorator'

@ApiTags('Service history')
@Controller('service-history')
export class ServiceHistroyController {
  constructor(
    private readonly serviceHistoryService: ServiceHistoryService,
    private readonly databaseServiceHistoryRepository: DatabaseServiceHistoryRepository,
  ) {}

  //Deprecated
  @Get()
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    type: [AllRecordsResponseDTO],
  })
  @ApiResponse({
    status: 400,
    description: `Record with this id doesn't exist`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public async DgetAllRecords(
    @Request() { carId },
  ): Promise<AllRecordsResponseDTO[]> {
    return this.serviceHistoryService.getAllRecords(carId)
  }

  //Deprecated
  @Post('refueling-history')
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'Refueling record was successfully added',
    type: ResponseRefuelingHistoryDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 6))
  @UsePipes(new PhotoValidationPipe())
  public DcreateRefuelingHistory(
    @Request() { carId },
    @Body() body: CreateRefuelingHistoryDTO,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<ResponseRefuelingHistoryDTO> {
    return this.serviceHistoryService.createRefuelingHistory(
      carId,
      body,
      photos,
    )
  }

  //Deprecated
  @Post('wash-history')
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'Wash record was successfully added',
    type: ResponseWashHistoryDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 6))
  @UsePipes(new PhotoValidationPipe())
  public DcreateWashHistory(
    @Request() { carId },
    @Body() body: CreateWashHistoryDTO,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<ResponseWashHistoryDTO> {
    return this.serviceHistoryService.createWashHistory(carId, body, photos)
  }

  //Deprecated
  @Post('technical-inspection')
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'Technical inspection record was successfully added',
    type: ResponseMaintenanceHistoryDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 6))
  @UsePipes(new PhotoValidationPipe())
  public async DcreateTechnicalInspectionHistory(
    @Request() { carId },
    @Body() body: CreateMaintenanceHistoryDTO,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<ResponseMaintenanceHistoryDTO> {
    return this.serviceHistoryService.createMaintenanceHistory(
      carId,
      body,
      photos,
      ServiceHistoryTypeEnum.TECHNICAL_INSPECTION,
    )
  }

  //Deprecated
  @Post('revision')
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'Revision record was successfully added',
    type: ResponseMaintenanceHistoryDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 6))
  @UsePipes(new PhotoValidationPipe())
  public async DcreateRevisionHistory(
    @Request() { carId },
    @Body() body: CreateMaintenanceHistoryDTO,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<ResponseMaintenanceHistoryDTO> {
    return this.serviceHistoryService.createMaintenanceHistory(
      carId,
      body,
      photos,
      ServiceHistoryTypeEnum.REVISION,
    )
  }

  //Deprecated
  @Post('repair')
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'Repair record was successfully added',
    type: ResponseMaintenanceHistoryDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 6))
  @UsePipes(new PhotoValidationPipe())
  public async DcreateRepairHistory(
    @Request() { carId },
    @Body() body: CreateMaintenanceHistoryDTO,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<ResponseMaintenanceHistoryDTO> {
    return this.serviceHistoryService.createMaintenanceHistory(
      carId,
      body,
      photos,
      ServiceHistoryTypeEnum.REPAIR,
    )
  }

  @UseGuards(CarUserGuard)
  @Get(':carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    type: [AllRecordsResponseDTO],
  })
  @ApiResponse({
    status: 400,
    description: `Record with this id doesn't exist`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public async getAllRecords(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
  ): Promise<AllRecordsResponseDTO[]> {
    return this.serviceHistoryService.getAllRecords(carId)
  }

  @UseGuards(CarUserGuard)
  @Get('refueling-favorites/:carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'All records',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public async getFavoritesFuelStation(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
  ): Promise<string[]> {
    return this.serviceHistoryService.getFavoritesFuelStation(carId)
  }

  @UseGuards(CarUserGuard)
  @Get('refueling-favorites')
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'All records',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public async getUserFavoritesFuelStation(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
  ): Promise<string[]> {
    return this.serviceHistoryService.getUserFavoritesFuelStation(token)
  }

  @UseGuards(CarUserGuard)
  @Get('wash-favorites/:carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'All records',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public async getFavoritesWashStation(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
  ): Promise<string[]> {
    return this.serviceHistoryService.getFavoritesWashStation(carId)
  }

  @UseGuards(CarUserGuard)
  @Get('wash-favorites')
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'All records',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public async getUserFavoritesWashStation(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
  ): Promise<string[]> {
    return this.serviceHistoryService.getUserFavoritesWashStation(token)
  }

  @UseGuards(CarUserGuard)
  @Get('maintenance-favorites/:carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'All records',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public async getFavoritesMaintenanceStation(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
  ): Promise<string[]> {
    return this.serviceHistoryService.getFavoritesMaintenanceStation(carId)
  }

  @UseGuards(CarUserGuard)
  @Get('maintenance-favorites')
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'All records',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public async getUserFavoritesMaintenanceStation(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
  ): Promise<string[]> {
    return this.serviceHistoryService.getUserFavoritesMaintenanceStation(token)
  }

  @UseGuards(ServiceHistoryGuard('refuelingHistory'))
  @Get('refueling-history/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Refueling history record',
    type: ResponseRefuelingHistoryDTO,
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
    description: 'This record is not yours',
  })
  public getRefuelingHistory(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<ResponseRefuelingHistoryDTO> {
    return this.serviceHistoryService.getRefuelingHistory(id)
  }

  @UseGuards(ServiceHistoryGuard('washHistory'))
  @Get('wash-history/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Wash history record',
    type: ResponseWashHistoryDTO,
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
    description: 'This record is not yours',
  })
  public getWashHistory(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<ResponseWashHistoryDTO> {
    return this.serviceHistoryService.getWashHistory(id)
  }

  @UseGuards(ServiceHistoryGuard('maintenanceHistory'))
  @Get('maintenance-history/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance history record',
    type: ResponseMaintenanceHistoryDTO,
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
    description: 'This record is not yours',
  })
  public getTechnicalInspectionHistory(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<ResponseMaintenanceHistoryDTO> {
    return this.serviceHistoryService.getMaintenanceHistory(id)
  }

  @ApiExcludeEndpoint()
  @UseGuards(CarUserGuard)
  @Get('refueling-history/:carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Refueling history records',
    type: [ResponseRefuelingHistoryDTO],
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public getAllRefuelingHistory(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
  ): Promise<ResponseRefuelingHistoryDTO[]> {
    return this.serviceHistoryService.getAllRefuelingHistory(carId)
  }

  @ApiExcludeEndpoint()
  @UseGuards(CarUserGuard)
  @Get('wash-history/:carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Wash history records',
    type: [ResponseRefuelingHistoryDTO],
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public getAllWashHistory(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
  ): Promise<ResponseWashHistoryDTO[]> {
    return this.serviceHistoryService.getAllWashHistory(carId)
  }

  @ApiExcludeEndpoint()
  @UseGuards(CarUserGuard)
  @Get('technical-inspection/:carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Technical inspection history records',
    type: [ResponseMaintenanceHistoryDTO],
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public getAllTechnicalInspectionHistory(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
  ): Promise<ResponseMaintenanceHistoryDTO[]> {
    return this.serviceHistoryService.getAllMaintenanceHistoryByType(
      carId,
      ServiceHistoryTypeEnum.TECHNICAL_INSPECTION,
    )
  }

  @ApiExcludeEndpoint()
  @UseGuards(CarUserGuard)
  @Get('revision/:carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Revision history records',
    type: [ResponseMaintenanceHistoryDTO],
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public getAllRevisionHistory(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
  ): Promise<ResponseMaintenanceHistoryDTO[]> {
    return this.serviceHistoryService.getAllMaintenanceHistoryByType(
      carId,
      ServiceHistoryTypeEnum.REVISION,
    )
  }

  @ApiExcludeEndpoint()
  @UseGuards(CarUserGuard)
  @Get('repair/:carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Repair history records',
    type: [ResponseMaintenanceHistoryDTO],
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public getAllRepairHistory(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
  ): Promise<ResponseMaintenanceHistoryDTO[]> {
    return this.serviceHistoryService.getAllMaintenanceHistoryByType(
      carId,
      ServiceHistoryTypeEnum.REPAIR,
    )
  }

  @UseGuards(CarUserGuard)
  @Post('refueling-history/:carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'Refueling record was successfully added',
    type: ResponseRefuelingHistoryDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 6))
  @UsePipes(new PhotoValidationPipe())
  public createRefuelingHistory(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
    @Body() body: CreateRefuelingHistoryDTO,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<ResponseRefuelingHistoryDTO> {
    return this.serviceHistoryService.createRefuelingHistory(
      carId,
      body,
      photos,
    )
  }

  @UseGuards(CarUserGuard)
  @Post('wash-history/:carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'Wash record was successfully added',
    type: ResponseWashHistoryDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 6))
  @UsePipes(new PhotoValidationPipe())
  public createWashHistory(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
    @Body() body: CreateWashHistoryDTO,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<ResponseWashHistoryDTO> {
    return this.serviceHistoryService.createWashHistory(carId, body, photos)
  }

  @UseGuards(CarUserGuard)
  @Post('technical-inspection/:carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'Technical inspection record was successfully added',
    type: ResponseMaintenanceHistoryDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 6))
  @UsePipes(new PhotoValidationPipe())
  public async createTechnicalInspectionHistory(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
    @Body() body: CreateMaintenanceHistoryDTO,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<ResponseMaintenanceHistoryDTO> {
    return this.serviceHistoryService.createMaintenanceHistory(
      carId,
      body,
      photos,
      ServiceHistoryTypeEnum.TECHNICAL_INSPECTION,
    )
  }

  @UseGuards(CarUserGuard)
  @Post('revision/:carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'Revision record was successfully added',
    type: ResponseMaintenanceHistoryDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 6))
  @UsePipes(new PhotoValidationPipe())
  public async createRevisionHistory(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
    @Body() body: CreateMaintenanceHistoryDTO,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<ResponseMaintenanceHistoryDTO> {
    return this.serviceHistoryService.createMaintenanceHistory(
      carId,
      body,
      photos,
      ServiceHistoryTypeEnum.REVISION,
    )
  }

  @UseGuards(CarUserGuard)
  @Post('repair/:carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'Repair record was successfully added',
    type: ResponseMaintenanceHistoryDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 6))
  @UsePipes(new PhotoValidationPipe())
  public async createRepairHistory(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
    @Body() body: CreateMaintenanceHistoryDTO,
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<ResponseMaintenanceHistoryDTO> {
    return this.serviceHistoryService.createMaintenanceHistory(
      carId,
      body,
      photos,
      ServiceHistoryTypeEnum.REPAIR,
    )
  }

  @UseGuards(ServiceHistoryGuard('refuelingHistory'))
  @Patch('refueling-history/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('updatedPhotos', 6))
  @UsePipes(new PhotoValidationPipe())
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Refueling record was successfully updated',
    type: ResponseRefuelingHistoryDTO,
  })
  @ApiResponse({
    status: 400,
    description: `Record with this id doesn't exist or problem with file uploading(format, size)`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'This record is not yours',
  })
  public updateRefuelingHistory(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
    @Body() body: UpdateRefuelingHistoryDTO,
    @UploadedFiles() updatedPhotos: Express.Multer.File[],
  ): Promise<ResponseRefuelingHistoryDTO> {
    return this.serviceHistoryService.updateRefuelingHistory(
      id,
      body,
      updatedPhotos,
    )
  }

  @UseGuards(ServiceHistoryGuard('washHistory'))
  @Patch('wash-history/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('updatedPhotos', 6))
  @UsePipes(new PhotoValidationPipe())
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Wash record was successfully updated',
    type: ResponseWashHistoryDTO,
  })
  @ApiResponse({
    status: 400,
    description: `Record with this id doesn't exist or problem with file uploading(format, size)`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'This record is not yours',
  })
  public updateWashHistory(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
    @Body() body: UpdateWashHistoryDTO,
    @UploadedFiles() updatedPhotos: Express.Multer.File[],
  ): Promise<ResponseWashHistoryDTO> {
    return this.serviceHistoryService.updateWashHistory(id, body, updatedPhotos)
  }

  @UseGuards(ServiceHistoryGuard('maintenanceHistory'))
  @Patch('maintenance-history/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('updatedPhotos', 6))
  @UsePipes(new PhotoValidationPipe())
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance record was successfully updated',
    type: ResponseMaintenanceHistoryDTO,
  })
  @ApiResponse({
    status: 400,
    description: `Record with this id doesn't exist or problem with file uploading(format, size)`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'This record is not yours',
  })
  public updateMaintenanceHistory(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
    @Body() body: UpdateMaintenanceHistoryDTO,
    @UploadedFiles() updatedPhotos: Express.Multer.File[],
  ): Promise<ResponseMaintenanceHistoryDTO> {
    return this.serviceHistoryService.updateMaintenanceHistory(
      id,
      body,
      updatedPhotos,
    )
  }

  @UseGuards(ServiceHistoryGuard('refuelingHistory'))
  @Delete('refueling-history/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Refueling record was successfully deleted',
    type: ResponseRefuelingHistoryDTO,
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
    description: 'This record is not yours',
  })
  public deleteRefuelingHistory(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<void> {
    return this.databaseServiceHistoryRepository.deleteRefuelingHistory(id)
  }

  @UseGuards(ServiceHistoryGuard('washHistory'))
  @Delete('wash-history/:id')
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Wash record was successfully deleted',
    type: ResponseRefuelingHistoryDTO,
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
    description: 'This record is not yours',
  })
  public deleteWashHistory(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<void> {
    return this.databaseServiceHistoryRepository.deleteWashHistory(id)
  }

  @UseGuards(ServiceHistoryGuard('maintenanceHistory'))
  @Delete('maintenance-history/:id')
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiParam({ name: 'id' })
  @ApiHeader({ name: 'token' })
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Maintenance record was successfully deleted',
    type: ResponseRefuelingHistoryDTO,
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
    description: 'This record is not yours',
  })
  public deleteMaintenanceHistory(
    @RequestParam(IdParamDTO) { id }: IdParamDTO,
  ): Promise<void> {
    return this.databaseServiceHistoryRepository.deleteMaintenanceHistory(id)
  }

  @UseGuards(CarUserGuard)
  @Get('wash-history/monthly/:carId')
  @ApiParam({ name: 'carId' })
  @ApiQuery({ name: 'year', required: false })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Wash monthly history records',
    type: [ResponseMonthlyHistoryDTO],
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public getMonthlyWashHistory(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
    @RequestQuery(YearParamDTO) { year }: YearParamDTO,
  ): Promise<ResponseMonthlyHistoryDTO> {
    return this.serviceHistoryService.getMonthlyWashHistory(carId, year)
  }

  @UseGuards(CarUserGuard)
  @Get('maintenance-history/monthly/:carId')
  @ApiParam({ name: 'carId' })
  @ApiQuery({ name: 'year', required: false })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance monthly history records',
    type: [ResponseMonthlyHistoryDTO],
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public getMonthlyMaintenanceHistory(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
    @RequestQuery(YearParamDTO) { year }: YearParamDTO,
  ): Promise<ResponseMonthlyHistoryDTO> {
    return this.serviceHistoryService.getMonthlyMaintenanceHistory(carId, year)
  }

  @UseGuards(CarUserGuard)
  @Get('refueling-history/monthly/:carId')
  @ApiParam({ name: 'carId' })
  @ApiQuery({ name: 'year', required: false })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Refueling monthly history records',
    type: [ResponseRefuelingHistoryDTO],
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public getMonthlyRefuelingHistory(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
    @RequestQuery(YearParamDTO) { year }: YearParamDTO,
  ): Promise<ResponseMonthlyRefuelingHistoryDTO> {
    return this.serviceHistoryService.getMonthlyRefuelingHistory(carId, year)
  }
}
