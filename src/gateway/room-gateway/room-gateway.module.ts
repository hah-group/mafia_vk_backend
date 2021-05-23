import { Module } from '@nestjs/common';
import { RoomGateway } from './room.gateway';
import { RoomGatewayService } from './room-gateway.service';
import { RoomUserModule } from '../../room-user/room-user.module';
import { RoomModule } from '../../room/room.module';

@Module({
  providers: [RoomGateway, RoomGatewayService],
  imports: [RoomUserModule, RoomModule],
})
export class RoomGatewayModule {}
