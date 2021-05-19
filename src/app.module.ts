import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { VkIoModule } from './vk-io/vk-io.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    VkIoModule.registerAsync({
      token: process.env.API_SERVICE_TOKEN,
    }),
  ],
})
export class AppModule {}
