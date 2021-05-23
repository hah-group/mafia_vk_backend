import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuthSocket } from '../type/auth-socket';
import { StatusResponseDto } from '../dto/status-response.dto';
import { UseFilters, UseGuards } from '@nestjs/common';
import { JwtGatewayAuthGuard } from '../guard/jwt-gateway-auth.guard';
import { OnEvent } from '@nestjs/event-emitter';
import { RoomInternalEventEnum } from '../../room/enum/room-internal-event.enum';
import { Room } from '@prisma/client';
import { Server } from 'socket.io';
import { PublicGatewayRequestEventInterface } from './interface/public-gateway-request-event.interface';
import { PublicGatewayResponseEventInterface } from './interface/public-gateway-response-event.interface';
import { GATEWAY_SETTINGS } from '../gateway-settings';
import { HttpGatewayFilter } from '../http-gateway.filter';

@UseFilters(new HttpGatewayFilter())
@WebSocketGateway(GATEWAY_SETTINGS)
export class PublicGateway {
  @WebSocketServer() server: Server<
    PublicGatewayRequestEventInterface,
    PublicGatewayResponseEventInterface
  >;

  @UseGuards(JwtGatewayAuthGuard)
  @SubscribeMessage('public/subscribe')
  subscribe(@ConnectedSocket() client: AuthSocket): StatusResponseDto {
    client.join('events');

    return {
      status: true,
    };
  }

  @UseGuards(JwtGatewayAuthGuard)
  @SubscribeMessage('public/unsubscribe')
  unsubscribe(@ConnectedSocket() client: AuthSocket): StatusResponseDto {
    const isSubscribe = client.rooms.has('events');

    if (isSubscribe) client.except('events');

    return {
      status: isSubscribe,
    };
  }

  @OnEvent(RoomInternalEventEnum.CREATE)
  handleRoomCreate(room: Room) {
    this.server.to('events').emit('public/event/room/create', room);
  }
}
