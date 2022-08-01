import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator'

import { LICINSE_PLATES } from 'src/car/constants/licensePlates'

export const IsCarNumberFormat = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return ValidateBy(
    {
      name: '',
      constraints: [],
      validator: {
        validate: (value: string): boolean =>
          value ? Object.keys(LICINSE_PLATES).includes(value) : false,
        defaultMessage: buildMessage(
          () => `enter valid format of car number`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  )
}
