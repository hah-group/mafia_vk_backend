import { Room } from '@prisma/client';
import { Socket } from 'socket.io';

export class RoomSocket extends Socket {
  room: Room;
}
