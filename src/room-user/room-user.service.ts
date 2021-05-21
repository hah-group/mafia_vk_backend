import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Room, RoomUser, User } from '@prisma/client';

@Injectable()
export class RoomUserService {
  constructor(private prisma: PrismaService) {}

  async roomUserCount(where: Prisma.RoomUserWhereInput): Promise<number> {
    return this.prisma.roomUser.count({
      where: where,
    });
  }

  async createRoomUser(room: Room, user: User): Promise<RoomUser> {
    return this.prisma.roomUser.create({
      data: {
        User: {
          connect: {
            id: user.id,
          },
        },
        Room: {
          connect: {
            id: room.id,
          },
        },
      },
    });
  }
}
