import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator'
import { Types } from 'mongoose'

export const IsId = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return ValidateBy(
    {
      name: '',
      constraints: [],
      validator: {
        validate: (value: string): boolean =>
          value ? Types.ObjectId.isValid(value) : false,
        defaultMessage: buildMessage(() => 'Enter valid id', validationOptions),
      },
    },
    validationOptions,
  )
}
