import { Injectable } from '@nestjs/common';
import { Role, SizeRule } from '@prisma/client';
import { SizeRuleService } from '../../size-rule/size-rule.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { RoomIdUtil } from '../room-gateway/room-id.util';
import { TimeIntervalEnum } from './time-interval.enum';
import { PublicRoomType } from '../room-gateway/type/public-room.type';
import { UserGatewayInternalEventEnum } from '../user-gateway/user-gateway-internal-event.enum';
import { RoomService } from '../../room/room.service';
import { RoomStateEnum } from '../../room/enum/room-state.enum';

@Injectable()
export class GameGatewayService {
  constructor(
    private roomService: RoomService,
    private sizeRuleService: SizeRuleService,
    private eventEmitter: EventEmitter2,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  private genRolesArray(
    sizeRules: (SizeRule & {
      Role: Role;
    })[],
  ): Role[] {
    const roles: Role[] = [];

    sizeRules.forEach((sizeRule) => {
      roles.push(...Array<Role>(sizeRule.quantity).fill(sizeRule.Role));
    });
    roles.push(...Array<Role>(sizeRules[0].size - roles.length).fill(null));

    return roles;
  }

  private shuffle(roles: Role[]): Role[] {
    return roles.sort(() => Math.random() - 0.5);
    //TODO IMPORTANT! Replace sorting algorithm
  }

  private addTimeout(name: string, milliseconds: number, callback: () => void) {
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  async distributeRoles(room: PublicRoomType): Promise<Role[]> {
    const sizeRules = await this.sizeRuleService.findMany({
      where: {
        size: room.size,
      },
      include: {
        Role: true,
      },
    });

    return this.shuffle(this.genRolesArray(sizeRules));
  }

  async start(room: PublicRoomType) {
    const { RoomUser, RoomType, ...roomData } = room;
    roomData.state = RoomStateEnum.IN_GAME;
    await this.roomService.update(roomData);

    this.addTimeout(
      `${RoomIdUtil(room)}_START`,
      TimeIntervalEnum.START,
      async () => {
        const roles = await this.distributeRoles(room);
        this.eventEmitter.emit(
          UserGatewayInternalEventEnum.ROLE_DATA,
          room,
          roles,
        );
      },
    );
  }
}
