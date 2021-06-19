import { Injectable } from '@nestjs/common';
import { Prisma, RoomType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomTypeService {
  constructor(private prisma: PrismaService) {}

  async roomTypes<T extends Prisma.RoomTypeFindManyArgs>(
    params: Prisma.SelectSubset<T, Prisma.RoomTypeFindManyArgs>,
  ): Promise<
    Prisma.CheckSelect<
      T,
      Promise<RoomType[]>,
      Promise<Prisma.RoomTypeGetPayload<T, keyof T>[]>
    >
  > {
    return this.prisma.roomType.findMany(params);
  }
}
