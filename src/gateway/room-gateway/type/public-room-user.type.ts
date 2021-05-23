import { RoomUser, User } from '@prisma/client';

export type PublicRoomUserType = Pick<RoomUser, 'is_dead' | 'status'> & {
  User: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar_src'>;
};
