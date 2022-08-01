import { HttpStatus, PipeTransform } from '@nestjs/common'

import { LocalizeError } from 'src/errors/localize.error'

const TEN_MEGABYTES = 10485760

export class InsuranceValidationPipe implements PipeTransform {
  transform(value) {
    if (value?.mimetype) {
      const { mimetype, size } = value
      const splitedMimetype = mimetype.split('/')

      if (!(splitedMimetype[0] !== 'image' || splitedMimetype[1] !== 'pdf'))
        throw new LocalizeError(
          LocalizeError.ONLY_IMAGE_OR_PDF,
          HttpStatus.BAD_REQUEST,
        )

      if (splitedMimetype[1] === 'svg+xml')
        throw new LocalizeError(LocalizeError.NO_SVG, HttpStatus.BAD_REQUEST)

      if (size > TEN_MEGABYTES)
        throw new LocalizeError(
          LocalizeError.IMAGE_OR_PDF_SIZE,
          HttpStatus.BAD_REQUEST,
        )
    }
    return value
  }
}
