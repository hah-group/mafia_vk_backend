import { Injectable } from '@nestjs/common';
import { ExtendSocket } from '../type/extend-socket';
import { GatewayRoomNoFullException } from './exception/gateway-room-no-full.exception';
import { RoomUserStatusEnum } from '../../room-user/enum/room-user-status.enum';
import { RoomUserService } from '../../room-user/room-user.service';
import { PublicRoomType } from '../room-gateway/type/public-room.type';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserGatewayService {
  constructor(
    private roomUserService: RoomUserService,
    private eventEmitter: EventEmitter2,
  ) {}

  async count(client: ExtendSocket): Promise<number> {
    return this.roomUserService.count({
      room_id: client.room.id,
    });
  }

  async resetReadyStatus(room: PublicRoomType): Promise<PublicRoomType> {
    await this.roomUserService.updateMany({
      where: {
        room_id: room.id,
        status: RoomUserStatusEnum.READY,
      },
      data: {
        status: RoomUserStatusEnum.CONNECTED,
      },
    });

    return {
      ...room,
      RoomUser: room.RoomUser.map((user) => {
        if (user.status === RoomUserStatusEnum.READY)
          user.status = RoomUserStatusEnum.CONNECTED;
        return user;
      }),
    };
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
