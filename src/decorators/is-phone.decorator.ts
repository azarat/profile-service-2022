import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator'

export const IsPhoneDecorator = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return ValidateBy(
    {
      name: '',
      constraints: [],
      validator: {
        validate: (value: string): boolean =>
          value ? !!value.match(/^\+380\d{9}/) && value.length === 13 : false,
        defaultMessage: buildMessage(
          () => `enter valid phone number in format: +380XXXXXXXXX`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  )
}
