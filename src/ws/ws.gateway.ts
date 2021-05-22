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
import { SocketDisconnectReasonEnum } from './socket-disconnect-reason.enum';

@UseFilters(new HttpWsFilter())
@WebSocketGateway({
  path: '/public',
  pingTimeout: 5000,
  pingInterval: 5000,
})
export class WsGateway {
  @WebSocketServer() server: Server;

  constructor(private wsService: WsService) {}

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
    await this.wsService.roomConnect(client);

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

  handleConnection(client: ExtendSocket) {
    client.on('disconnect', (reason) => this.disconnect(client, reason));
  }

  async disconnect(client: ExtendSocket, reason: string) {
    if (!client.gameRoom || !client.user) return;

    switch (reason) {
      case SocketDisconnectReasonEnum.SERVER_NAMESPACE_DISCONNECT:
      case SocketDisconnectReasonEnum.CLIENT_NAMESPACE_DISCONNECT:
        await this.wsService.clientDisconnect(client);
        break;
      default:
        await this.wsService.clientError(client);
        const roomId = `room#${client.gameRoom.id}#${client.gameRoom.token}`;
        this.server.to(roomId).emit(RoomEventEnum.USER_ERROR, {
          id: client.user.id,
        });
    }
  }
}
