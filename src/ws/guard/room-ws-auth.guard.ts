import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConnectRoomDto } from '../dto/connect-room.dto';
import { RoomService } from '../../room/room.service';
import { RoomSocket } from '../type/room-socket';

@Injectable()
export class RoomWsAuthGuard implements CanActivate {
  constructor(private roomService: RoomService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const data = context.switchToWs().getData<ConnectRoomDto>();

    const room = await this.roomService.room({
      where: {
        id: data.id,
      },
    });

    if (room && room.token === data.token)
      context.switchToWs().getClient<RoomSocket>().gameRoom = room;

    return room && room.token === data.token;
  }
}
