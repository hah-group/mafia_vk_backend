import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Room, RoomUser, User } from '@prisma/client';
import { RoomUserStatusEnum } from './enum/room-user-status.enum';

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
    connectionStatus: RoomUserStatusEnum,
  ): Promise<RoomUser> {
    return this.prisma.roomUser.upsert({
      where: {
        room_user: {
          room_id: room.id,
          user_id: user.id,
        },
      },
      update: {
        status: connectionStatus,
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
        status: connectionStatus,
      },
    });
  }

  async updateRoomUser<T extends Prisma.RoomUserUpdateArgs>(
    params: Prisma.SelectSubset<T, Prisma.RoomUserUpdateArgs>,
  ): Promise<
    Prisma.CheckSelect<
      T,
      Promise<RoomUser>,
      Promise<Prisma.RoomUserGetPayload<T, keyof T>>
    >
  > {
    return this.prisma.roomUser.update(params);
  }

  async deleteRoomUser(params: {
    where: Prisma.RoomUserWhereUniqueInput;
  }): Promise<RoomUser> {
    return this.prisma.roomUser.delete(params);
  }
}
