import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsOptional } from 'class-validator'

import { DocumentTypesEnum } from 'src/documents/enums/document-types.enum'

export class ResponseTechnicalPassportDTO {
  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  id: string

  @ApiProperty({ example: 'ААА' })
  series: string

  @ApiProperty({ example: '108429' })
  number: string

  @ApiProperty({ example: 'КА5810ВО' })
  carNumber: string

  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  @IsOptional()
  user?: string

  @ApiProperty({ example: DocumentTypesEnum.TECHNICAL_PASSPORT })
  type: DocumentTypesEnum.TECHNICAL_PASSPORT
}

export class TechnicalPassportParamDTO {
  @Expose({ name: 'technicalPassport' })
  technicalPassport: string
}
