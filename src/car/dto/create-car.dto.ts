import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { IsCarNumberFormat } from 'src/decorators/is-car-number-formate.decorator'

import { IsCarNumber } from 'src/decorators/is-car-number.decorator'
import { VinDecorator } from 'src/decorators/vin.decorator'
import { CarService } from '../car.service'
import { LICINSE_PLATES } from '../constants/licensePlates'

export class TestDTO {
  @ApiProperty({ example: 1985 })
  @IsNumber()
  @Min(1900)
  @Max(+new Date().getUTCFullYear())
  year: number
}
export class CreateCarDTO {
  @ApiProperty({ example: 1985 })
  @IsNumber()
  @Min(1900)
  @Max(+new Date().getUTCFullYear())
  year: number

  @ApiProperty({ example: 'Toyota' })
  @IsString()
  mark: string

  @ApiProperty({ example: 'Supra' })
  @IsString()
  model: string

  @ApiProperty({ example: 'Supra (A7)' })
  @IsOptional()
  @IsString()
  modelType: string

  @ApiProperty({ example: 'Toyota Supra (A7) 3.0 Turbo (MA70)' })
  @IsOptional()
  @IsString()
  modification: string

  @ApiProperty({ example: 'Toyota Supra (A7) 3.0 Turbo (MA70)' })
  @IsOptional()
  @IsString()
  generation: string

  @ApiProperty({ example: 'Седан' })
  @IsOptional()
  @IsString()
  bodyType: string

  @ApiProperty({ example: 87234 })
  @IsNumber()
  mileage: number

  @ApiProperty({ required: false, example: '4Y1SL65848Z411439' })
  @IsOptional()
  @VinDecorator()
  vin?: string

  @ApiProperty({ required: false, example: 'КА8013АО' })
  @IsOptional()
  @IsCarNumber()
  licensePlate?: string

  @ApiProperty({ required: false, example: CarService.DEFAULT_PLATE_FORMAT })
  @Transform(({ value }) => (!value ? CarService.DEFAULT_PLATE_FORMAT : value))
  @IsCarNumberFormat()
  @IsOptional()
  plateFormat?: keyof typeof LICINSE_PLATES
}
