import { Room, RoomType } from '@prisma/client';
import { PublicRoomUserType } from './public-room-user.type';

export type PublicRoomType = Room & {
  RoomUser: PublicRoomUserType[];
  RoomType: RoomType;
};
