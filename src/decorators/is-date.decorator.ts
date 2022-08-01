import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator'

export const IsDate = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return ValidateBy(
    {
      name: '',
      constraints: [],
      validator: {
        validate: (value: string): boolean =>
          value
            ? !!value.match(/^[0-9]{2}[\.]{1}[0-9]{2}[\.]{1}[0-9]{4}$/g)
            : false,
        defaultMessage: buildMessage(
          () => 'Enter valid format of date',
          validationOptions,
        ),
      },
    },
    validationOptions,
  )
}
