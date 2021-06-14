import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Room } from '@prisma/client';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoomAvailability } from './enum/room-availability';
import { RoomStateEnum } from './enum/room-state.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoomInternalEventEnum } from './enum/room-internal-event.enum';
import { RoomListItemInterface } from './interface/room-list-item.interface';

@UseGuards(JwtAuthGuard)
@Controller('room')
export class RoomController {
  constructor(
    private roomService: RoomService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post('create')
  async create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    const room = await this.roomService.createRoom(createRoomDto);
    this.eventEmitter.emit(RoomInternalEventEnum.CREATE, room);
    return room;
  }

  @Get('list')
  async list(): Promise<RoomListItemInterface[]> {
    return this.roomService.rooms({
      where: {
        availability: RoomAvailability.PUBLIC,
        state: RoomStateEnum.CREATED,
      },
      include: {
        RoomUser: {
          select: {
            User: {
              select: {
                avatar_src: true,
              },
            },
          },
        },
      },
    });
  }
}
