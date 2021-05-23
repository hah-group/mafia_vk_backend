import { Injectable } from '@nestjs/common';
import { ExtendSocket } from '../type/extend-socket';
import { GatewayRoomNoFullException } from './exception/gateway-room-no-full.exception';
import { RoomUserStatusEnum } from '../../room-user/enum/room-user-status.enum';
import { RoomUserService } from '../../room-user/room-user.service';

@Injectable()
export class UserGatewayService {
  constructor(private roomUserService: RoomUserService) {}

  async count(client: ExtendSocket): Promise<number> {
    return this.roomUserService.count({
      room_id: client.room.id,
    });
  }

  async updateRoomUserStatus(socket: ExtendSocket, status: RoomUserStatusEnum) {
    await this.roomUserService.update({
      where: {
        room_user: {
          room_id: socket.room.id,
          user_id: socket.user.id,
        },
      },
      data: {
        status: status,
      },
    });
  }

  async ready(socket: ExtendSocket): Promise<void> {
    if ((await this.count(socket)) < socket.room.size)
      throw new GatewayRoomNoFullException();

    await this.updateRoomUserStatus(socket, RoomUserStatusEnum.READY);
  }
}
