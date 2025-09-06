import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin:
      configService.get<string>('AEROVEX_FRONTEND_URL') ||
      'http://localhost:5173',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  const documentFactory = new DocumentBuilder()
    .setTitle('Aerovex backend API')
    .setDescription('Implementation a very basic RBAC mechanism using NestJs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, documentFactory);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
