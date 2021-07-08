import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GATEWAY_SETTINGS } from '../gateway-settings';
import { OnEvent } from '@nestjs/event-emitter';
import { GameGatewayInternalEventEnum } from './game-gateway-internal-event.enum';
import { PublicRoomType } from '../room-gateway/type/public-room.type';
import { GameGatewayService } from './game-gateway.service';
import { GameGatewayResponseEventInterface } from './interface/game-gateway-response-event.interface';
import { Server } from 'socket.io';
import { RoomIdUtil } from '../room-gateway/room-id.util';

@WebSocketGateway(GATEWAY_SETTINGS)
export class GameGateway {
  @WebSocketServer() server: Server<null, GameGatewayResponseEventInterface>;

  constructor(private gameGatewayService: GameGatewayService) {}

  @OnEvent(GameGatewayInternalEventEnum.START)
  async start(room: PublicRoomType): Promise<void> {
    await this.gameGatewayService.start(room);
    this.server.to(RoomIdUtil(room)).emit('GAME_START');
  }

  /*@UseGuards(AuthUserGatewayGuard, RoomWsAuthGuard)
  @SubscribeMessage(GameGatewayRequestEventEnum.GAME_READY)
  async gameReady() {}*/
}
