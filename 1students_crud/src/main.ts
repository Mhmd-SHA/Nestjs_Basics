import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument } from './swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  //
  app.setGlobalPrefix('api');
  SwaggerModule.setup('api', app, createDocument(app));
  //
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
