import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Room } from '@prisma/client';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoomAvailability } from './enum/room-availability';
import { RoomStateEnum } from './enum/room-state.enum';

@UseGuards(JwtAuthGuard)
@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post('create')
  async create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomService.createRoom(createRoomDto);
  }

  @Get('list')
  async list(): Promise<Room[]> {
    return this.roomService.rooms({
      where: {
        availability: RoomAvailability.PUBLIC,
        state: RoomStateEnum.CREATED,
      },
    });
  }
}
