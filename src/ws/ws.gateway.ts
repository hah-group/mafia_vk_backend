import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { UseFilters, UseGuards } from '@nestjs/common';
import { JwtWsAuthGuard } from './jwt-ws-auth.guard';
import { HttpWsFilter } from './http-ws.filter';
import { StatusResponseDto } from './dto/status-response.dto';

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
  auth(@ConnectedSocket() client: Socket): StatusResponseDto {
    client.to('events');
    return {
      status: true,
    };
  }
}
