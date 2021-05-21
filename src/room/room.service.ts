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

  async room(params: { where: Prisma.RoomWhereUniqueInput }): Promise<Room> {
    return this.prisma.room.findUnique(params);
  }

  async rooms(params: { where: Prisma.RoomWhereInput }): Promise<Room[]> {
    return this.prisma.room.findMany(params);
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
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
    });
  }
}
