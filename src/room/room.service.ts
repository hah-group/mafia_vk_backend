import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { Room } from '@prisma/client';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomStateEnum } from './enum/room-state.enum';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const token = crypto.randomBytes(48);
    return this.prisma.room.create({
      data: {
        token: token.toString('base64'),
        type: createRoomDto.type,
        size: createRoomDto.size,
        state: RoomStateEnum.CREATED,
      },
    });
  }
}
