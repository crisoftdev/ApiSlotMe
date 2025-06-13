import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser'; // 👈 AÑADIR

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.use(cookieParser());

  app.enableCors({
    origin: true, // permite todos los orígenes
    credentials: true,
  });

  // 👇 Permitir subir imágenes de hasta 10MB
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

  app.useGlobalPipes(new ValidationPipe());

 await app.listen(process.env.PORT || 3000);
}
bootstrap();
