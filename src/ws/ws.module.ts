import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { JwtWsStrategy } from './guard/jwt-ws.strategy';
import { UserModule } from '../user/user.module';
import { WsService } from './ws.service';
import { RoomUserModule } from '../room-user/room-user.module';
import { RoomModule } from '../room/room.module';

@Module({
  providers: [WsGateway, JwtWsStrategy, WsService],
  imports: [UserModule, RoomUserModule, RoomModule],
})
export class WsModule {}
