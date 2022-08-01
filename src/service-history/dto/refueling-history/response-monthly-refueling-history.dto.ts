import { IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { ResponseFuelTypesDTO } from './response-fuel-types.dto'

export class ResponseMonthlyRefuelingHistoryDTO {
  @ApiProperty({ example: 500 })
  @IsOptional()
  january?: ResponseFuelTypesDTO

  @ApiProperty({ example: 500 })
  @IsOptional()
  february?: ResponseFuelTypesDTO

  @ApiProperty({ example: 500 })
  @IsOptional()
  march?: ResponseFuelTypesDTO

  @ApiProperty({ example: 500 })
  @IsOptional()
  april?: ResponseFuelTypesDTO

  @ApiProperty({ example: 500 })
  @IsOptional()
  may?: ResponseFuelTypesDTO

  @ApiProperty({ example: 500 })
  @IsOptional()
  june?: ResponseFuelTypesDTO

  @ApiProperty({ example: 500 })
  @IsOptional()
  july?: ResponseFuelTypesDTO

  @ApiProperty({ example: 500 })
  @IsOptional()
  august?: ResponseFuelTypesDTO

  @ApiProperty({ example: 500 })
  @IsOptional()
  september?: ResponseFuelTypesDTO

  @ApiProperty({ example: 500 })
  @IsOptional()
  october?: ResponseFuelTypesDTO

  @ApiProperty({ example: 500 })
  @IsOptional()
  november?: ResponseFuelTypesDTO

  @ApiProperty({ example: 500 })
  @IsOptional()
  december?: ResponseFuelTypesDTO
}
