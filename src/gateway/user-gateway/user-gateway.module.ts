import { Module } from '@nestjs/common';
import { UserGatewayService } from './user-gateway.service';
import { UserGateway } from './user.gateway';
import { RoomUserModule } from '../../room-user/room-user.module';
import { RoomModule } from '../../room/room.module';

@Module({
  providers: [UserGatewayService, UserGateway],
  imports: [RoomUserModule, RoomModule],
})
export class UserGatewayModule {}
