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
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestHeader } from 'src/decorators/request-header.decorator'
import TokenHeaderDTO from 'src/common-dto/token-header.dto'
import { CarService } from './car.service'
import { CarResponseDTO } from './dto/car-response.dto'
import { CreateCarDTO } from './dto/create-car.dto'
import { UpdateCarDTO } from './dto/update-car.dto'
import { CarUserGuard } from 'src/auth/guards/car-user.guard'
import { RequestParam } from 'src/decorators/request-params.decorator'
import { CarParamDTO } from 'src/common-dto/car-param.dto'
import QrTokenHeaderDTO from 'src/common-dto/qr-header.dto'

@Controller('car')
@ApiTags('Car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'cars',
    type: [CarResponseDTO],
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public getCars(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
  ): Promise<CarResponseDTO[]> {
    return this.carService.getCars(token)
  }

  @UseGuards(CarUserGuard)
  @Get('transfer/:carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'jwt',
    type: 'string',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'This car is not yours',
  })
  public createCarTransfer(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
  ): Promise<string> {
    return this.carService.createCarTransfer(carId)
  }

  @Post()
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 201,
    description: 'Car was successfully added',
    type: CarResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public createCar(
    @Body() car: CreateCarDTO,
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
  ): Promise<CarResponseDTO> {
    return this.carService.createCar(car, token)
  }

  @Patch('transfer')
  @ApiHeader({ name: 'token' })
  @ApiHeader({ name: 'qrtoken' })
  @ApiResponse({
    status: 200,
    description: 'Car was successfully transfered',
    type: CarResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  public completeCarTransfer(
    @RequestHeader(TokenHeaderDTO) { token }: TokenHeaderDTO,
    @RequestHeader(QrTokenHeaderDTO) { qrtoken }: QrTokenHeaderDTO,
  ): Promise<CarResponseDTO> {
    return this.carService.completeCarTransfer(token, qrtoken)
  }

  @UseGuards(CarUserGuard)
  @Patch(':carId')
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 200,
    description: 'Car was successfully updated',
    type: CarResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: `Car with this id doesn't exist`,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'This car is not yours',
  })
  public updateCar(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
    @Body() updatedCar: UpdateCarDTO,
  ): Promise<CarResponseDTO> {
    return this.carService.updateCar(carId, updatedCar)
  }

  @UseGuards(CarUserGuard)
  @Delete(':carId')
  @HttpCode(204)
  @ApiParam({ name: 'carId' })
  @ApiHeader({ name: 'token' })
  @ApiHeader({
    name: 'accept-language',
    description: 'en | ru | uk | nothing',
  })
  @ApiResponse({
    status: 204,
    description: 'Car was deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: `Car with this id doesn't exist`,
  })
  @ApiResponse({
    status: 403,
    description: 'This car is not yours',
  })
  public deleteCar(
    @RequestParam(CarParamDTO) { carId }: CarParamDTO,
  ): Promise<void> {
    return this.carService.deleteCar(carId)
  }
}
