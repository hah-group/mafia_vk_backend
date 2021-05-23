import { Room } from '@prisma/client';

export function RoomIdUtil(room: Room): string {
  return `room#${room.id}#${room.token}`;
}
