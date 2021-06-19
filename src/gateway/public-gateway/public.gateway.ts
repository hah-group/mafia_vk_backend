import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuthSocket } from '../type/auth-socket';
import { StatusResponseDto } from '../dto/status-response.dto';
import { UseFilters } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RoomInternalEventEnum } from '../../room/enum/room-internal-event.enum';
import { Server } from 'socket.io';
import { PublicGatewayRequestEventInterface } from './interface/public-gateway-request-event.interface';
import { PublicGatewayResponseEventInterface } from './interface/public-gateway-response-event.interface';
import { GATEWAY_SETTINGS } from '../gateway-settings';
import { HttpGatewayFilter } from '../http-gateway.filter';
import { PublicRoomType } from '../room-gateway/type/public-room.type';

@UseFilters(new HttpGatewayFilter())
@WebSocketGateway(GATEWAY_SETTINGS)
export class PublicGateway {
  @WebSocketServer() server: Server<
    PublicGatewayRequestEventInterface,
    PublicGatewayResponseEventInterface
  >;

  @SubscribeMessage('PUBLIC_SUBSCRIBE')
  subscribe(@ConnectedSocket() client: AuthSocket): StatusResponseDto {
    client.join('events');

    return {
      status: true,
    };
  }

  @SubscribeMessage('PUBLIC_UNSUBSCRIBE')
  unsubscribe(@ConnectedSocket() client: AuthSocket): StatusResponseDto {
    const isSubscribe = client.rooms.has('events');

    if (isSubscribe) client.except('events');

    return {
      status: isSubscribe,
    };
  }

  @OnEvent(RoomInternalEventEnum.CREATE)
  handleRoomCreate(room: PublicRoomType) {
    this.server.to('events').emit('PUBLIC_ROOM_CREATE', room);
  }

  @OnEvent(RoomInternalEventEnum.UPDATE)
  handleRoomUpdate(room: PublicRoomType) {
    this.server.to('events').emit('PUBLIC_ROOM_UPDATE', room);
  }
}
