import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SocketIoAdapter } from './socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useWebSocketAdapter(new SocketIoAdapter(app, [/\w*/]));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
