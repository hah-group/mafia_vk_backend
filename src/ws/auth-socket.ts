import { User } from '@prisma/client';
import { Socket } from 'socket.io';

export interface AuthSocket extends Socket {
  user: User;
}
