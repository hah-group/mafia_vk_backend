import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GATEWAY_SETTINGS } from '../gateway-settings';
import { ExtendSocket } from '../type/extend-socket';
import { StatusResponseDto } from '../dto/status-response.dto';
import { RoomGatewayService } from './room-gateway.service';
import { UseGuards } from '@nestjs/common';
import { JwtGatewayAuthGuard } from '../guard/jwt-gateway-auth.guard';
import { RoomWsAuthGuard } from '../guard/room-gateway-auth.guard';
import { Server } from 'socket.io';
import { RoomGatewayRequestEventInterface } from './interface/room-gateway-request-event.interface';
import { RoomGatewayResponseEventInterface } from './interface/room-gateway-response-event.interface';
import { ConnectRoomResponseDto } from './dto/connect-room-response.dto';
import { RoomIdUtil } from './room-id.util';

@WebSocketGateway(GATEWAY_SETTINGS)
export class RoomGateway {
  @WebSocketServer() server: Server<
    RoomGatewayRequestEventInterface,
    RoomGatewayResponseEventInterface
  >;

  constructor(private roomGatewayService: RoomGatewayService) {}

  @UseGuards(JwtGatewayAuthGuard, RoomWsAuthGuard)
  @SubscribeMessage('room/connect')
  async connect(
    @ConnectedSocket() client: ExtendSocket,
  ): Promise<ConnectRoomResponseDto> {
    const roomUser = await this.roomGatewayService.connect(client);
    const roomPublic = await this.roomGatewayService.publicData(client.room);

    const roomId = RoomIdUtil(client.room);
    this.server.to(roomId).emit('room/connectUser', {
      User: roomUser,
    });

    client.join(roomId);

    return {
      status: true,
      data: {
        Room: roomPublic,
      },
    };
  }

  @UseGuards(JwtGatewayAuthGuard, RoomWsAuthGuard)
  @SubscribeMessage('room/disconnect')
  async disconnect(
    @ConnectedSocket() client: ExtendSocket,
  ): Promise<StatusResponseDto> {
    const roomId = RoomIdUtil(client.room);
    const isSubscribe = Object.keys(client.rooms).indexOf(roomId) > -1;
    if (!isSubscribe) {
      return {
        status: isSubscribe,
      };
    }

    client.leave(roomId);
    const roomUser = await this.roomGatewayService.disconnect(client);
    this.server.to(roomId).emit('room/disconnectUser', {
      User: roomUser,
    });

    return {
      status: isSubscribe,
    };
  }

  /*handleConnection(client: ExtendSocket) {
    client.on('disconnect', (reason) => this.terminate(client, reason));
  }

  async terminate(client: ExtendSocket, reason: string) {
    if (!client.room || !client.user) return;

    switch (reason) {
      case SocketDisconnectReasonEnum.SERVER_NAMESPACE_DISCONNECT:
      case SocketDisconnectReasonEnum.CLIENT_NAMESPACE_DISCONNECT:
        await this.wsService.clientDisconnect(client);
        break;
      default:
        await this.wsService.clientError(client);
    }

    await this.roomSync(client);
  }*/
}
