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
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RoomInternalEventEnum } from '../../room/enum/room-internal-event.enum';
import { AuthUserGatewayGuard } from '../auth-gateway/auth-user-gateway.guard';
import { PublicRoomType } from './type/public-room.type';

@WebSocketGateway(GATEWAY_SETTINGS)
export class RoomGateway {
  @WebSocketServer() server: Server<
    RoomGatewayRequestEventInterface,
    RoomGatewayResponseEventInterface
  >;

  constructor(
    private roomGatewayService: RoomGatewayService,
    private eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(AuthUserGatewayGuard, RoomWsAuthGuard)
  @SubscribeMessage('ROOM_CONNECT')
  async connect(
    @ConnectedSocket() client: ExtendSocket,
  ): Promise<ConnectRoomResponseDto> {
    await this.roomGatewayService.connect(client);

    const roomPublic = await this.roomGatewayService.publicData(client.room);
    this.eventEmitter.emit(RoomInternalEventEnum.UPDATE, roomPublic);

    const roomId = RoomIdUtil(client.room);
    client.join(roomId);

    return {
      status: true,
      data: {
        Room: roomPublic,
      },
    };
  }

  @UseGuards(JwtGatewayAuthGuard, RoomWsAuthGuard)
  @SubscribeMessage('ROOM_DISCONNECT')
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
    await this.roomGatewayService.disconnect(client);

    const roomPublic = await this.roomGatewayService.publicData(client.room);
    this.eventEmitter.emit(RoomInternalEventEnum.UPDATE, roomPublic);

    return {
      status: isSubscribe,
    };
  }

  async handleDisconnect(client: ExtendSocket) {
    if (!client.user || !client.room) return;

    await this.roomGatewayService.userTerminated(client);

    const roomPublic = await this.roomGatewayService.publicData(client.room);
    this.eventEmitter.emit(RoomInternalEventEnum.UPDATE, roomPublic);
  }

  @OnEvent(RoomInternalEventEnum.UPDATE)
  onRoomUpdate(room: PublicRoomType) {
    const roomId = RoomIdUtil(room);
    this.server.to(roomId).emit('ROOM_UPDATE', room);
  }
}
