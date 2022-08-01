import { Expose } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { TypeEnum } from '../enums/type.enum'

export class QueryTypeDTO {
  @Expose({ name: 'type' })
  @IsEnum(TypeEnum)
  type: TypeEnum
}
