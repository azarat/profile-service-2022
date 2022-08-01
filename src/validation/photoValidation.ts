import { HttpStatus, PipeTransform } from '@nestjs/common'

import { LocalizeError } from 'src/errors/localize.error'

const FIVE_MEGABYTES = 5242880

export class PhotoValidationPipe implements PipeTransform {
  transform(value) {
    if (value?.mimetype) {
      const { mimetype, size } = value
      const splitedMimetype = mimetype.split('/')

      if (splitedMimetype[0] !== 'image')
        throw new LocalizeError(
          LocalizeError.ONLY_IMAGE,
          HttpStatus.BAD_REQUEST,
        )

      if (splitedMimetype[1] === 'svg+xml')
        throw new LocalizeError(LocalizeError.NO_SVG, HttpStatus.BAD_REQUEST)

      if (size > FIVE_MEGABYTES)
        throw new LocalizeError(
          LocalizeError.IMAGE_SIZE,
          HttpStatus.BAD_REQUEST,
        )
    }
    return value
  }
}
