import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator'
import { LICINSE_PLATES } from 'src/car/constants/licensePlates'

export const IsCarNumber = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return ValidateBy(
    {
      name: '',
      constraints: [],
      validator: {
        validate: (value: string): boolean =>
          value
            ? Object.values(LICINSE_PLATES).some((reg) => value.match(reg))
            : false,
        defaultMessage: buildMessage(
          () => `enter valid car number`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  )
}
