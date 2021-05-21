import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Room, RoomUser, User } from '@prisma/client';
import { ConnectionRoomUserStatusEnum } from './enum/connection-room-user-status.enum';

@Injectable()
export class RoomUserService {
  constructor(private prisma: PrismaService) {}

  async roomUserCount(where: Prisma.RoomUserWhereInput): Promise<number> {
    return this.prisma.roomUser.count({
      where: where,
    });
  }

  async upsertRoomUser(
    room: Room,
    user: User,
    connectionStatus: ConnectionRoomUserStatusEnum,
  ): Promise<RoomUser> {
    return this.prisma.roomUser.upsert({
      where: {
        room_user: {
          room_id: room.id,
          user_id: user.id,
        },
      },
      update: {
        connection_status: connectionStatus,
      },
      create: {
        Room: {
          connect: {
            id: room.id,
          },
        },
        User: {
          connect: {
            id: user.id,
          },
        },
        connection_status: connectionStatus,
      },
    });
  }
}
