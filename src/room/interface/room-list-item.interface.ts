import { Room, User } from '@prisma/client';

export interface RoomListItemInterface extends Room {
  RoomUser: {
    User: Pick<User, 'avatar_src'>;
  }[];
}
