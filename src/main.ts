import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.MAF_SERVER_PORT);
  Logger.log(
    `The server is running on port ${process.env.MAF_SERVER_PORT}`,
    'NestApplication',
    false,
  );
}

bootstrap();
