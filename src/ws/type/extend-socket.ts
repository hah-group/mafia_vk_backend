import { RoomSocket } from './room-socket';
import { AuthSocket } from './auth-socket';

export interface ExtendSocket extends AuthSocket, RoomSocket {}
