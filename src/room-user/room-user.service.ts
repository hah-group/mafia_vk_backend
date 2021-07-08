import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, RoomUser } from '@prisma/client';

@Injectable()
export class RoomUserService {
  constructor(private prisma: PrismaService) {}

  async findUnique<T extends Prisma.RoomUserFindUniqueArgs>(
    params: Prisma.SelectSubset<T, Prisma.RoomUserFindUniqueArgs>,
  ): Promise<
    Prisma.CheckSelect<
      T,
      Promise<RoomUser>,
      Promise<Prisma.RoomUserGetPayload<T, keyof T>>
    >
  > {
    return this.prisma.roomUser.findUnique(params);
  }

  async count(where: Prisma.RoomUserWhereInput): Promise<number> {
    return this.prisma.roomUser.count({
      where: where,
    });
  }

  async upsert<T extends Prisma.RoomUserUpsertArgs>(
    params: Prisma.SelectSubset<T, Prisma.RoomUserUpsertArgs>,
  ): Promise<
    Prisma.CheckSelect<
      T,
      Promise<RoomUser>,
      Promise<Prisma.RoomUserGetPayload<T, keyof T>>
    >
  > {
    return this.prisma.roomUser.upsert(params);
  }

  async update<T extends Prisma.RoomUserUpdateArgs>(
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

  async updateMany<T extends Prisma.RoomUserUpdateManyArgs>(
    params: Prisma.SelectSubset<T, Prisma.RoomUserUpdateManyArgs>,
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.roomUser.updateMany(params);
  }

  async delete<T extends Prisma.RoomUserDeleteArgs>(
    params: Prisma.SelectSubset<T, Prisma.RoomUserDeleteArgs>,
  ): Promise<
    Prisma.CheckSelect<
      T,
      Promise<RoomUser>,
      Promise<Prisma.RoomUserGetPayload<T, keyof T>>
    >
  > {
    return this.prisma.roomUser.delete(params);
  }
}
