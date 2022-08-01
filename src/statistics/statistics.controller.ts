import { Controller, Get, UseGuards, Request } from '@nestjs/common'
import {
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { RequestQuery } from 'src/decorators/request-query.decorator'
import { QueryTypeDTO } from './dto/query-type.dto'
import { GeneralStatisticResponseDTO } from './dto/general-statistic-response.dto'
import { StatisticTwoResponseDTO } from './dto/statistic-two-response.dto'
import { TypeEnum } from './enums/type.enum'
import { StatisticsService } from './statistics.service'
import { RefuelingStatisticResponseDTO } from './dto/refueling-statistic-response.dto'
import { RequestParam } from 'src/decorators/request-params.decorator'
import { CarUserGuard } from 'src/auth/guards/car-user.guard'
import { CarParamDTO } from 'src/common-dto/car-param.dto'

@Controller('statistics')
@ApiTags('Statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  //Depracted
  @Get('general')
  @ApiQuery({ name: 'type', enum: TypeEnum })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    type: GeneralStatisticResponseDTO,
  })
  public DgetGeneralStatistic(
    @Request() { carId },
    @RequestQuery(QueryTypeDTO) { type }: QueryTypeDTO,
  ): Promise<GeneralStatisticResponseDTO> {
    return this.statisticsService.getGeneralStatistic(carId, type)
  }

  //Depracted
  @Get('refueling')
  @ApiQuery({ name: 'type', enum: TypeEnum })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    type: RefuelingStatisticResponseDTO,
  })
  public DgetRefuelingStatistic(
    @Request() { carId },
    @RequestQuery(QueryTypeDTO) { type }: QueryTypeDTO,
  ): Promise<RefuelingStatisticResponseDTO> {
    return this.statisticsService.getRefuelingStatistic(carId, type)
  }

  //Depracted
  @Get('car-wash')
  @ApiQuery({ name: 'type', enum: TypeEnum })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    type: StatisticTwoResponseDTO,
  })
  public DgetCarWashStatistic(
    @Request() { carId },
    @RequestQuery(QueryTypeDTO) { type }: QueryTypeDTO,
  ): Promise<StatisticTwoResponseDTO> {
    return this.statisticsService.getCarWashStatistic(carId, type)
  }

  //Depracted
  @Get('maintenance')
  @ApiQuery({ name: 'type', enum: TypeEnum })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    type: StatisticTwoResponseDTO,
  })
  public DgetMaintenanceStatistic(
    @Request() { carId },
    @RequestQuery(QueryTypeDTO) { type }: QueryTypeDTO,
  ): Promise<StatisticTwoResponseDTO> {
    return this.statisticsService.getMaintenanceStatistic(carId, type)
  }

  @Get('general/:carId')
  @ApiParam({ name: 'carId' })
  @ApiQuery({ name: 'type', enum: TypeEnum })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    type: GeneralStatisticResponseDTO,
  })
  public getGeneralStatistic(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
    @RequestQuery(QueryTypeDTO) { type }: QueryTypeDTO,
  ): Promise<GeneralStatisticResponseDTO> {
    return this.statisticsService.getGeneralStatistic(carId, type)
  }

  @UseGuards(CarUserGuard)
  @Get('refueling/:carId')
  @ApiParam({ name: 'carId' })
  @ApiQuery({ name: 'type', enum: TypeEnum })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    type: RefuelingStatisticResponseDTO,
  })
  public getRefuelingStatistic(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
    @RequestQuery(QueryTypeDTO) { type }: QueryTypeDTO,
  ): Promise<RefuelingStatisticResponseDTO> {
    return this.statisticsService.getRefuelingStatistic(carId, type)
  }

  @UseGuards(CarUserGuard)
  @Get('car-wash/:carId')
  @ApiParam({ name: 'carId' })
  @ApiQuery({ name: 'type', enum: TypeEnum })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    type: StatisticTwoResponseDTO,
  })
  public getCarWashStatistic(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
    @RequestQuery(QueryTypeDTO) { type }: QueryTypeDTO,
  ): Promise<StatisticTwoResponseDTO> {
    return this.statisticsService.getCarWashStatistic(carId, type)
  }

  @UseGuards(CarUserGuard)
  @Get('maintenance/:carId')
  @ApiParam({ name: 'carId' })
  @ApiQuery({ name: 'type', enum: TypeEnum })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    type: StatisticTwoResponseDTO,
  })
  public getMaintenanceStatistic(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
    @RequestQuery(QueryTypeDTO) { type }: QueryTypeDTO,
  ): Promise<StatisticTwoResponseDTO> {
    return this.statisticsService.getMaintenanceStatistic(carId, type)
  }
}
