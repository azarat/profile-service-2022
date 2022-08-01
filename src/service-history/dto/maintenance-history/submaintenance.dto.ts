import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class SubRecordHistory {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNumber()
  price: number
}
