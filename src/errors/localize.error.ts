import { HttpException, HttpStatus } from '@nestjs/common'
import * as dotenv from 'dotenv'

import { ILocalizeError } from './interfaces'

dotenv.config()

export class LocalizeError extends HttpException {
  static readonly COMPLETE_REGISTRATION = {
    en: 'Complete user registration firstly',
    ru: 'Завершите регистрацию пользователя',
    uk: 'Завершіть реєстрацію користувача',
  }
  static readonly PHONE_EXISTS = {
    en: 'User with this phone already exists',
    ru: 'Пользователь с этим номером телефона уже существует',
    uk: 'Користувач з цим номером телефона уже існує',
  }
  static readonly WRONG_PHONE = {
    en: `User with this phone doesn't exist`,
    ru: 'Пользователя с этим номером телефона не существует',
    uk: 'Користувача з цим номером телефона не існує',
  }
  static readonly INVALID_PHONE = {
    en: 'Invalid phone number',
    ru: 'Неверный номер телефона',
    uk: 'Невірний номер телефона',
  }
  static readonly INVALID_CODE = {
    en: 'Invalid phone or code',
    ru: 'Неверный номер телефона или код',
    uk: 'Невірний номер телефона або код',
  }
  static readonly DOCUMENTS_LIMITATION = {
    en: `You can add only ${process.env.MAX_DOCUMENTS} documents`,
    ru: `Вы можете добавить только ${process.env.MAX_DOCUMENTS} документа`,
    uk: `Ви можете додати лише ${process.env.MAX_DOCUMENTS} документи`,
  }
  static readonly NO_AVATAR = {
    en: 'This user has no avatar',
    ru: 'У вас нет аватарки',
    uk: 'У вас немає аватарки',
  }
  static readonly ONLY_IMAGE = {
    en: 'You can upload only image',
    ru: 'Вы можете загружать только изображения',
    uk: 'Ви можете завантажити лише зображення',
  }
  static readonly ONLY_IMAGE_OR_PDF = {
    en: 'You can upload only image or PDF file',
    ru: 'Вы можете загружать только изображения или PDF файл',
    uk: 'Ви можете завантажити лише зображення або PDF файл',
  }
  static readonly NO_SVG = {
    en: 'You cannot load svg',
    ru: 'Вы не можете загрузить SVG',
    uk: 'Ви не можете завантажити svg',
  }
  static readonly IMAGE_SIZE = {
    en: 'Image size must be lower than 5 megabytes',
    ru: 'Размер изображения не должен превышать 5 мегабайтов',
    uk: 'Розмір зображення має бути менше 5 мегабайтів',
  }
  static readonly IMAGE_OR_PDF_SIZE = {
    en: 'File size must be lower than 10 megabytes',
    ru: 'Размер файла не должен превышать 10 мегабайтов',
    uk: 'Розмір файла має бути менше 10 мегабайтів',
  }
  static readonly TOO_MANY_PHOTOS = {
    en: 'You cannot add more than 6 photos',
    ru: 'Вы не можете добавить более 6 фото',
    uk: 'Ви не можете додати більше 6 фотографій',
  }
  static readonly USER_NOT_EXISTS = {
    en: "This user doesn't exist. Sign up please",
    ru: 'Этот пользователь не существует. Зарегистрируйтесь пожалуйста',
    uk: 'Користувача не знайдено. Зареєструйтесь будь ласка',
  }
  static readonly NO_CAR = {
    en: 'Add a car to keep your service history',
    ru: 'Добавьте машину, чтобы вести историю обслуживания',
    uk: 'Додайте машину, щоб вести історію обслуговування',
  }

  constructor(message: string | ILocalizeError, status: HttpStatus) {
    super(message, status)
  }
}
