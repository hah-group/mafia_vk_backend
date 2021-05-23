import { Injectable } from '@nestjs/common';
import { ExtendSocket } from '../type/extend-socket';
import { GatewayRoomFullException } from './exception/gateway-room-full.exception';
import { RoomUserStatusEnum } from '../../room-user/enum/room-user-status.enum';
import { RoomUserService } from '../../room-user/room-user.service';
import { Room } from '@prisma/client';
import { PublicRoomType } from './type/public-room.type';
import { RoomService } from '../../room/room.service';
import { PublicRoomUserType } from './type/public-room-user.type';

@Injectable()
export class RoomGatewayService {
  constructor(
    private roomUserService: RoomUserService,
    private roomService: RoomService,
  ) {}

  async connect(client: ExtendSocket): Promise<PublicRoomUserType> {
    const playerCount = await this.roomUserService.count({
      room_id: client.room.id,
    });

    ///TODO Implement double connections

    if (playerCount >= client.room.size) throw new GatewayRoomFullException();

    ///TODO Что то с этим сделать
    return this.roomUserService.upsert({
      select: {
        is_dead: true,
        status: true,
        User: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatar_src: true,
          },
        },
      },
      where: {
        room_user: {
          room_id: client.room.id,
          user_id: client.user.id,
        },
      },
      update: {
        status: RoomUserStatusEnum.CONNECTED,
      },
      create: {
        status: RoomUserStatusEnum.CONNECTED,
        User: {
          connect: {
            id: client.user.id,
          },
        },
        Room: {
          connect: {
            id: client.room.id,
          },
        },
      },
    });
  }

  async disconnect(client: ExtendSocket): Promise<PublicRoomUserType> {
    ///TODO Валидация отключения
    return this.roomUserService.delete({
      select: {
        is_dead: true,
        status: true,
        User: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatar_src: true,
          },
        },
      },
      where: {
        room_user: {
          room_id: client.room.id,
          user_id: client.user.id,
        },
      },
    });
  }

  async publicData(room: Room): Promise<PublicRoomType> {
    return this.roomService.room({
      where: {
        id: room.id,
      },
      include: {
        RoomType: true,
        RoomUser: {
          select: {
            is_dead: true,
            status: true,
            User: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                avatar_src: true,
              },
            },
          },
        },
      },
    });
  }
}
