import { ApiProperty } from '@nestjs/swagger'

import { DocumentTypesEnum } from 'src/documents/enums/document-types.enum'

export class ResponseINNDTO {
  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  id: string

  @ApiProperty({ example: '361867311' })
  number: string

  @ApiProperty({ example: 'КА5810ВО' })
  carNumber: string

  @ApiProperty({ example: DocumentTypesEnum.INN })
  type: DocumentTypesEnum.INN
}
