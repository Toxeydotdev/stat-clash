import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { configureApp } from './configure-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env['PORT'] ?? 3333);

  configureApp(app);
  app.enableShutdownHooks();
  await app.listen(port);
  Logger.log(`API listening at http://localhost:${port}/api`);
}

bootstrap().catch((error: unknown) => {
  Logger.error('API failed to start', error);
  process.exitCode = 1;
});
