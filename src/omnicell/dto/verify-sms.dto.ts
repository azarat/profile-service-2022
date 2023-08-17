import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

import { IsPhoneDecorator } from 'src/decorators/is-phone.decorator'

class VerifySMSBodyDTO {
    @ApiProperty({ example: '+380674613280' })
    @IsPhoneDecorator()
    phone: string

    @ApiProperty({ example: '123456' })
    code: string
}

export default VerifySMSBodyDTO
