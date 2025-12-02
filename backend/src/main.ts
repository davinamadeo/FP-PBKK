import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS - PENTING untuk frontend!
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Add global prefix (optional)
  // app.setGlobalPrefix('api');

  await app.listen(3001);
  console.log('🚀 Backend running on http://localhost:3001');
}
bootstrap();