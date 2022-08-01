import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { HttpExceptionFilter } from './errors/http-exception.filter'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.enableVersioning({
    type: VersioningType.URI,
  })
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Profile')
    .setDescription('Profile API')
    .setVersion('1.0')
    .addServer(process.env.API_HOST)
    .build()
  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
    { swaggerOptions: { operationsSorter: 'method' } },
  )
  await app.listen(process.env.PORT)
}
bootstrap()
