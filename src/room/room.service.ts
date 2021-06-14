import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { Prisma, Room } from '@prisma/client';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomStateEnum } from './enum/room-state.enum';
import { RoomAvailability } from './enum/room-availability';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async room<T extends Prisma.RoomFindUniqueArgs>(
    params: Prisma.SelectSubset<T, Prisma.RoomFindUniqueArgs>,
  ): Promise<
    Prisma.CheckSelect<
      T,
      Promise<Room>,
      Promise<Prisma.RoomGetPayload<T, keyof T>>
    >
  > {
    return this.prisma.room.findUnique(params);
  }

  async rooms<T extends Prisma.RoomFindManyArgs>(
    params: Prisma.SelectSubset<T, Prisma.RoomFindManyArgs>,
  ): Promise<
    Prisma.CheckSelect<
      T,
      Promise<Room[]>,
      Promise<Prisma.RoomGetPayload<T, keyof T>[]>
    >
  > {
    return this.prisma.room.findMany(params);
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<PublicRoomType> {
    const token = crypto.randomBytes(48);
    return this.prisma.room.create({
      data: {
        token: token.toString('base64'),
        size: createRoomDto.size,
        state: RoomStateEnum.CREATED,
        availability: RoomAvailability.PUBLIC,
        RoomType: {
          connect: {
            id: createRoomDto.type,
          },
        },
      },
      include: PublicRoomTypeInclude,
    });
  }

  async update(room: Room): Promise<Room> {
    const { id, ...data } = room;
    return this.prisma.room.update({
      where: {
        id: id,
      },
      data: data,
    });
  }
}
