import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { LoggingInterceptor } from './shared/interceptors/logger.interceptor';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  const config = app.get(ConfigService);

  const port = config.get<number>('PORT')!;
  const host = config.get<string>('HOST')!;

  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.enableShutdownHooks();

  const swaggerCfg = new DocumentBuilder()
    .setTitle('Tea‑Tracker API')
    .setDescription('«Tea‑Tracker API» — NestJS + TypeScript + Zod')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerCfg);
  SwaggerModule.setup('docs', app, document);

  logger.log(`Swagger docs available at http://${host}:${port}/docs`);

  await app.listen(port, host, () => {
    logger.log(`Server started on http://${host}:${port}`);
  });
}

void bootstrap();
