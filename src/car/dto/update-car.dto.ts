import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

import { IsCarNumberFormat } from 'src/decorators/is-car-number-formate.decorator'
import { IsCarNumber } from 'src/decorators/is-car-number.decorator'
import { VinDecorator } from 'src/decorators/vin.decorator'
import { CarService } from '../car.service'
import { LICINSE_PLATES } from '../constants/licensePlates'

export class UpdateCarDTO {
  @ApiProperty({ required: false, example: 1985 })
  @IsNumber()
  @IsOptional()
  @Min(1900)
  @Max(+new Date().getUTCFullYear())
  year?: number

  @ApiProperty({ required: false, example: 'Toyota' })
  @IsString()
  @IsOptional()
  mark?: string

  @ApiProperty({ required: false, example: 'Supra' })
  @IsString()
  @IsOptional()
  model?: string

  @ApiProperty({ required: false, example: 'Supra (A7)' })
  @IsString()
  @IsOptional()
  modelType?: string

  @ApiProperty({
    required: false,
    example: 'Toyota Supra (A7) 3.0 Turbo (MA70)',
  })
  @IsString()
  @IsOptional()
  modification?: string

  @ApiProperty({ example: 'Седан' })
  @IsOptional()
  @IsString()
  bodyType: string

  @ApiProperty({ required: false, example: 87234 })
  @IsNumber()
  @IsOptional()
  mileage?: number

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
