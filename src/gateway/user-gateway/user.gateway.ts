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
import { RoomWsAuthGuard } from '../guard/room-gateway-auth.guard';
import { RemoteSocket, Server } from 'socket.io';
import { UserGatewayRequestEventInterface } from './interface/user-gateway-request-event.interface';
import { UserGatewayResponseEventInterface } from './interface/user-gateway-response-event.interface';
import { RoomIdUtil } from '../room-gateway/room-id.util';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Role } from '@prisma/client';
import { AuthSocket } from '../type/auth-socket';
import { RoomGatewayService } from '../room-gateway/room-gateway.service';
import { AuthUserGatewayGuard } from '../auth-gateway/auth-user-gateway.guard';
import { RoomInternalEventEnum } from '../../room/enum/room-internal-event.enum';
import { UserGatewayInternalEventEnum } from './user-gateway-internal-event.enum';
import { PublicRoomType } from '../room-gateway/type/public-room.type';
import { GameGatewayInternalEventEnum } from '../game-gateway/game-gateway-internal-event.enum';
import { RoomUserStatusEnum } from '../../room-user/enum/room-user-status.enum';

@WebSocketGateway(GATEWAY_SETTINGS)
export class UserGateway {
  constructor(
    private userGatewayService: UserGatewayService,
    private roomGatewayService: RoomGatewayService,
    private eventEmitter: EventEmitter2,
  ) {}

  @WebSocketServer() server: Server<
    UserGatewayRequestEventInterface,
    UserGatewayResponseEventInterface
  >;

  @UseGuards(AuthUserGatewayGuard, RoomWsAuthGuard)
  @SubscribeMessage('USER_READY')
  async ready(
    @ConnectedSocket() client: ExtendSocket,
  ): Promise<StatusResponseDto> {
    await this.userGatewayService.ready(client);
    const roomPublic = await this.roomGatewayService.publicData(client.room);

    this.eventEmitter.emit(RoomInternalEventEnum.UPDATE, roomPublic);

    const readyCount = roomPublic.RoomUser.filter(
      (user) => user.status === RoomUserStatusEnum.READY,
    ).reduce((sum) => sum + 1, 0);

    if (readyCount === roomPublic.size)
      this.eventEmitter.emit(GameGatewayInternalEventEnum.START, roomPublic);

    return {
      status: true,
    };
  }

  @OnEvent(UserGatewayInternalEventEnum.USER_CHANGE)
  async changeUsers(room: PublicRoomType) {
    await this.userGatewayService.resetReadyStatus(room);
    this.eventEmitter.emit(RoomInternalEventEnum.UPDATE, room);
  }

  @OnEvent(UserGatewayInternalEventEnum.ROLE_DATA)
  async roleData(room: PublicRoomType, roles: Role[]) {
    const playersSockets = await this.server
      .in(RoomIdUtil(room))
      .fetchSockets();

    playersSockets.forEach(
      (
        playerSocket: RemoteSocket<UserGatewayResponseEventInterface> &
          AuthSocket,
        index,
      ) => {
        if (roles[index] && roles[index].id < 2)
          ///TODO Change strategy
          playerSocket.join(`${RoomIdUtil(room)}_mafiaTeam`);

        playerSocket.emit('USER_ROLE_DATA', roles[index]);
      },
    );
  }
}
