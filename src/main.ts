import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import { AllExceptionFilters } from './common/filters/all-exception-filters';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new SantizeUsernamePipe());
  app.useGlobalFilters(new AllExceptionFilters());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use('/upload', express.static(join(__dirname, '..', 'uploads')));
  await app.listen(3000);
  console.log(`mongoDB URI is ${process.env.DB_URI}`);

  log(`Application is running on: http://localhost:3000`);
}
bootstrap();
