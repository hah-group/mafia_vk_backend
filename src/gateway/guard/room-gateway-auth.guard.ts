import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConnectRoomRequestDto } from '../room-gateway/dto/connect-room-request.dto';
import { RoomService } from '../../room/room.service';
import { RoomSocket } from '../room-gateway/type/room-socket';

@Injectable()
export class RoomWsAuthGuard implements CanActivate {
  constructor(private roomService: RoomService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<RoomSocket>();
    if (client.room) {
      const room = await this.roomService.room({
        where: {
          id: client.room.id,
        },
      });
      client.room = room;
      return true;
    }

    const data = context.switchToWs().getData<ConnectRoomRequestDto>();

    const room = await this.roomService.room({
      where: {
        id: data.id,
      },
    });

    if (room && room.token === data.token)
      context.switchToWs().getClient<RoomSocket>().room = room;

    return room && room.token === data.token;
  }
}
