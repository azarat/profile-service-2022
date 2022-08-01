import { ApiProperty } from '@nestjs/swagger'

class InsuranceResponseDTO {
  @ApiProperty({ example: '617a525430bcc7532fa1f46c' })
  id: string

  @ApiProperty({ example: 'AA1111AA' })
  number: string

  @ApiProperty({ example: '№123123123' })
  licensePlate: string

  @ApiProperty({ example: 'TAZ' })
  mark: string

  @ApiProperty({ example: '2021-11-03T15:30:05.784Z' })
  date: Date

  @ApiProperty({ example: 'file.pdf' })
  file: string
}

export default InsuranceResponseDTO
