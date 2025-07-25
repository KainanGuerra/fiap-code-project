import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';

import { version } from '../package.json';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const logger = app.get(Logger);
  const config = await app.resolve(ConfigService);

  app.enableCors({
    origin: config.getOrThrow('WL_CORS_ORIGIN'),
    allowedHeaders: config.getOrThrow('WL_CORS_HEADERS'),
    exposedHeaders: config.getOrThrow('WL_CORS_EXPOSE_HEADERS'),
    methods: config.getOrThrow('WL_CORS_METHODS'),
  });

  app.useLogger(logger);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: ['1'],
  });
  app.setGlobalPrefix('fiap');
  const port = parseInt(config.getOrThrow('PORT'));
  await app.listen({
    port,
    host: '0.0.0.0',
  });

  logger.log(
    `Application v${version} is running on: ${await app.getUrl()}, port: ${port}`,
  );
}

void bootstrap();
