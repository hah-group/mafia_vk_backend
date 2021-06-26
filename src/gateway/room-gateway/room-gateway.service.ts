import { Injectable } from '@nestjs/common';
import { ExtendSocket } from '../type/extend-socket';
import { GatewayRoomFullException } from './exception/gateway-room-full.exception';
import { RoomUserStatusEnum } from '../../room-user/enum/room-user-status.enum';
import { RoomUserService } from '../../room-user/room-user.service';
import { Prisma, Room, RoomUser } from '@prisma/client';
import { PublicRoomType } from './type/public-room.type';
import { RoomService } from '../../room/room.service';
import { GatewayRoomUserAlreadyConnectedException } from './exception/gateway-room-user-already-connected.exception';
import { PublicRoomTypeInclude } from '../../room/public-room-type.include';

@Injectable()
export class RoomGatewayService {
  constructor(
    private roomUserService: RoomUserService,
    private roomService: RoomService,
  ) {}

  public async findRoomUser(client: ExtendSocket): Promise<RoomUser> {
    return this.roomUserService.findUnique({
      where: {
        room_user: {
          room_id: client.room.id,
          user_id: client.user.id,
        },
      },
    });
  }

  private async userConnectAllowed(client: ExtendSocket): Promise<boolean> {
    const playerCount = await this.roomUserService.count({
      room_id: client.room.id,
    });

    const roomUser = await this.findRoomUser(client);

    if (roomUser && roomUser.status === RoomUserStatusEnum.CONNECTED)
      throw new GatewayRoomUserAlreadyConnectedException();

    if (roomUser && roomUser.status >= RoomUserStatusEnum.DISCONNECTED)
      return true;

    if (playerCount >= client.room.size) throw new GatewayRoomFullException();

    return true;
  }

  async connect(client: ExtendSocket): Promise<void> {
    await this.userConnectAllowed(client);

    await this.roomUserService.upsert({
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

  async disconnect(client: ExtendSocket): Promise<void> {
    await this.roomUserService.delete({
      where: {
        room_user: {
          room_id: client.room.id,
          user_id: client.user.id,
        },
      },
    });
  }

  async userTerminated(client: ExtendSocket): Promise<void> {
    await this.updateRoomUserStatus(client, RoomUserStatusEnum.DISCONNECTED);
  }

  async updateRoomUserStatus<T extends Prisma.RoomUserArgs>(
    client: ExtendSocket,
    status: RoomUserStatusEnum,
    params?: Prisma.SelectSubset<T, Prisma.RoomUserArgs>,
  ): Promise<
    Prisma.CheckSelect<
      T,
      Promise<RoomUser>,
      Promise<Prisma.RoomUserGetPayload<T, keyof T>>
    >
  > {
    return this.roomUserService.update({
      where: {
        room_user: {
          room_id: client.room.id,
          user_id: client.user.id,
        },
      },
      data: {
        status: status,
      },
      ...params,
    });
  }

  async publicData(room: Room): Promise<PublicRoomType> {
    return this.roomService.room({
      where: {
        id: room.id,
      },
      include: PublicRoomTypeInclude,
    });
  }
}
