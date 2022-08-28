import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, Length } from 'class-validator'
import { IsCarNumber } from 'src/decorators/is-car-number.decorator'

export class UpdateTechnicalPassportDTO {
  @ApiProperty({ required: false, example: 'ААА' })
  @IsString()
  @Length(3, 3)
  @IsOptional()
  series?: string

  @ApiProperty({ required: false, example: '108429' })
  @IsString()
  @Length(6, 6)
  @IsOptional()
  number?: string

  @ApiProperty({ example: 'КА5810ВО' })
  @IsString()
  @Length(3, 8)
  @IsCarNumber()
  @IsOptional()
  carNumber?: string
}
