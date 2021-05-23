import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GATEWAY_SETTINGS } from '../gateway-settings';
import { ExtendSocket } from '../type/extend-socket';
import { StatusResponseDto } from '../dto/status-response.dto';
import { UserGatewayService } from './user-gateway.service';
import { UseGuards } from '@nestjs/common';
import { JwtGatewayAuthGuard } from '../guard/jwt-gateway-auth.guard';
import { RoomWsAuthGuard } from '../guard/room-gateway-auth.guard';
import { Server } from 'socket.io';
import { UserGatewayRequestEventInterface } from './interface/user-gateway-request-event.interface';
import { UserGatewayResponseEventInterface } from './interface/user-gateway-response-event.interface';
import { RoomIdUtil } from '../room-gateway/room-id.util';

@WebSocketGateway(GATEWAY_SETTINGS)
export class UserGateway {
  constructor(private userGatewayService: UserGatewayService) {}

  @WebSocketServer() server: Server<
    UserGatewayRequestEventInterface,
    UserGatewayResponseEventInterface
  >;

  @UseGuards(JwtGatewayAuthGuard, RoomWsAuthGuard)
  @SubscribeMessage('user/ready')
  async ready(
    @ConnectedSocket() client: ExtendSocket,
  ): Promise<StatusResponseDto> {
    await this.userGatewayService.ready(client);

    this.server.to(RoomIdUtil(client.room)).emit('user/ready', {
      User: {
        id: client.user.id,
      },
    });

    return {
      status: true,
    };
  }
}
