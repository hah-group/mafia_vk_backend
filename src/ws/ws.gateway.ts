import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { UseFilters, UseGuards } from '@nestjs/common';
import { JwtWsAuthGuard } from './guard/jwt-ws-auth.guard';
import { HttpWsFilter } from './http-ws.filter';
import { StatusResponseDto } from './dto/status-response.dto';
import { AuthSocket } from './type/auth-socket';
import { OnEvent } from '@nestjs/event-emitter';
import { Room } from '@prisma/client';
import { RoomInternalEventEnum } from '../room/enum/room-internal-event.enum';
import { RoomWsAuthGuard } from './guard/room-ws-auth.guard';
import { ExtendSocket } from './type/extend-socket';
import { WsService } from './ws.service';
import { RoomEventEnum } from '../room/enum/room-event.enum';

@UseFilters(new HttpWsFilter())
@WebSocketGateway({
  path: '/public',
  pingTimeout: 5000,
  pingInterval: 5000,
})
export class WsGateway {
  constructor(private wsService: WsService) {}

  @WebSocketServer() server: Server;

  @UseGuards(JwtWsAuthGuard)
  @SubscribeMessage('auth/token')
  auth(@ConnectedSocket() client: AuthSocket): StatusResponseDto {
    client.join('events');
    return {
      status: true,
    };
  }

  @UseGuards(JwtWsAuthGuard, RoomWsAuthGuard)
  @SubscribeMessage('room/connect')
  async roomConnect(
    @ConnectedSocket() client: ExtendSocket,
  ): Promise<StatusResponseDto> {
    await this.wsService.roomConnect(client.gameRoom);

    const roomId = `room#${client.gameRoom.id}#${client.gameRoom.token}`;
    client.join(roomId);

    const { vk_access_token, online, ...user } = client.user;

    this.server.to(roomId).emit(RoomEventEnum.CONNECT, user);

    return {
      status: true,
    };
  }

  @OnEvent(RoomInternalEventEnum.CREATE)
  handleRoomCreate(room: Room) {
    this.server.to('events').emit('room/create', room);
  }
}
