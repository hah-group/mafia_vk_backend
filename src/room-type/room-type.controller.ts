import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoomType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoomTypeService } from './room-type.service';

@Controller('room_type')
export class RoomTypeController {
  constructor(private roomTypeService: RoomTypeService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async list(): Promise<RoomType[]> {
    return this.roomTypeService.roomTypes({});
  }
}
