import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RoomUserStatusEnum } from '../room-user/enum/room-user-status.enum';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    await this.roomUser.updateMany({
      data: {
        status: RoomUserStatusEnum.DISCONNECTED,
      },
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
