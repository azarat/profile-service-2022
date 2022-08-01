import { ApiProperty } from '@nestjs/swagger'

import { DocumentTypesEnum } from 'src/documents/enums/document-types.enum'

export class ResponseDriverLicenseDTO {
  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  id: string

  @ApiProperty({ example: 'ААА' })
  series: string

  @ApiProperty({ example: '534888' })
  number: string

  @ApiProperty({ example: '2021-11-25' })
  date: string

  @ApiProperty({ example: DocumentTypesEnum.DRIVER_LICENSE })
  type: DocumentTypesEnum.DRIVER_LICENSE
}
