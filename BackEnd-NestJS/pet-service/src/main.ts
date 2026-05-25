import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { TransformInterceptor } from './core/transform.interceptor';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import helmet from 'helmet';
import { TrimStringsPipe } from './core/trim-string.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  // config cors: allow multiple origins from FE_BASE_URL (comma-separated)
  const feBase = configService.get<string>('FE_BASE_URL') ?? '';
  const allowedOrigins = feBase
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    credentials: true,
  });

  app.use(helmet());

  await app.listen(configService.get<string>('PORT') ?? 8080);
}

bootstrap();
