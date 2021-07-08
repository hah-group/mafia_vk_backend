import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { VkIoModule } from './vk-io/vk-io.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RoomUserModule } from './room-user/room-user.module';
import { GatewayModule } from './gateway/gateway.module';
import { SizeRuleModule } from './size-rule/size-rule.module';
import { RoomTypeModule } from './room-type/room-type.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GameEngineModule } from './game-engine/game-engine.module';
import { GraphQLModule } from '@nestjs/graphql';

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
    EventEmitterModule.forRoot({
      delimiter: '/',
    }),
    RoomUserModule,
    GatewayModule,
    SizeRuleModule,
    RoomTypeModule,
    ScheduleModule.forRoot(),
    GameEngineModule,
    GraphQLModule.forRoot({
      playground: true,
      autoSchemaFile: 'schema.gql',
    }),
  ],
})
export class AppModule {}
