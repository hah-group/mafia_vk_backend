import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { VkIoModule } from './vk-io/vk-io.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(),
    AuthModule,
    VkIoModule.registerAsync({
      token: process.env.API_SERVICE_TOKEN,
    }),
    PrismaModule,
    UserModule,
    RoomModule,
  ],
})
export class AppModule {}
