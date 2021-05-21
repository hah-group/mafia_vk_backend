import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { UseFilters, UseGuards } from '@nestjs/common';
import { JwtWsAuthGuard } from './jwt-ws-auth.guard';
import { HttpWsFilter } from './http-ws.filter';
import { StatusResponseDto } from './dto/status-response.dto';
import { AuthSocket } from './auth-socket';
import { OnEvent } from '@nestjs/event-emitter';
import { Room } from '@prisma/client';
import { RoomInternalEventEnum } from '../room/enum/room-internal-event.enum';

@UseFilters(new HttpWsFilter())
@WebSocketGateway({
  path: '/public',
  pingTimeout: 5000,
  pingInterval: 5000,
})
export class WsGateway {
  @WebSocketServer() server: Server;

  @UseGuards(JwtWsAuthGuard)
  @SubscribeMessage('auth/token')
  auth(@ConnectedSocket() client: AuthSocket): StatusResponseDto {
    client.join('events');
    return {
      status: true,
    };
  }

  @OnEvent(RoomInternalEventEnum.CREATE)
  handleRoomCreate(room: Room) {
    console.log(room);
    this.server.to('events').emit('room/create', room);
  }
}
