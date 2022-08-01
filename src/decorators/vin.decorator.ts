import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator'

export const VinDecorator = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return ValidateBy(
    {
      name: '',
      constraints: [],
      validator: {
        validate: (value: string): boolean =>
          value === '' || value.length === 17,
        defaultMessage: buildMessage(
          () => `vin should be 17 symbols length or empty string`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  )
}
