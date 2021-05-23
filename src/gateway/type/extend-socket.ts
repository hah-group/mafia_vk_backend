import { RoomSocket } from '../room-gateway/type/room-socket';
import { AuthSocket } from './auth-socket';

export interface ExtendSocket extends AuthSocket, RoomSocket {}
