import { IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ResponseMonthlyHistoryDTO {
  @ApiProperty({ example: 500 })
  @IsOptional()
  january?: number

  @ApiProperty({ example: 500 })
  @IsOptional()
  february?: number

  @ApiProperty({ example: 500 })
  @IsOptional()
  march?: number

  @ApiProperty({ example: 500 })
  @IsOptional()
  april?: number

  @ApiProperty({ example: 500 })
  @IsOptional()
  may?: number

  @ApiProperty({ example: 500 })
  @IsOptional()
  june?: number

  @ApiProperty({ example: 500 })
  @IsOptional()
  july?: number

  @ApiProperty({ example: 500 })
  @IsOptional()
  august?: number

  @ApiProperty({ example: 500 })
  @IsOptional()
  september?: number

  @ApiProperty({ example: 500 })
  @IsOptional()
  october?: number

  @ApiProperty({ example: 500 })
  @IsOptional()
  november?: number

  @ApiProperty({ example: 500 })
  @IsOptional()
  december?: number
}
