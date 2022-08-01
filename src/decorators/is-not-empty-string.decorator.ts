import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator'

export const IsNotEmptyString = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return ValidateBy(
    {
      name: '',
      constraints: [],
      validator: {
        validate: (value): boolean => value !== '',
        defaultMessage: buildMessage(
          () => 'Must be not empty',
          validationOptions,
        ),
      },
    },
    validationOptions,
  )
}
