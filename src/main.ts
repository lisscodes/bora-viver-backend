import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  app.use((req: Request, _res: Response, next: NextFunction) => {
    Logger.log(`${req.method} ${req.url}`, 'HTTP');
    next();
  });
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  Logger.log('API em http://0.0.0.0:3000', 'Bootstrap');
}
bootstrap();
