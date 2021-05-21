import { Module } from '@nestjs/common';
import { RoomUserService } from './room-user.service';

@Module({
  providers: [RoomUserService],
  exports: [RoomUserService],
})
export class RoomUserModule {}
