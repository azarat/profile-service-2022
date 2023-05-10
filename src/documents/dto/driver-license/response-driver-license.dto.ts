import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsOptional } from 'class-validator'
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

  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  @IsOptional()
  user?: string

  @ApiProperty({ example: DocumentTypesEnum.DRIVER_LICENSE })
  type: DocumentTypesEnum.DRIVER_LICENSE
}

export class DriverLicenseParamDTO {
  @Expose({ name: 'driverLicense' })
  driverLicense: string
}
