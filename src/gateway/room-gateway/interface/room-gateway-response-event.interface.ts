import { UserRoomUpdateDto } from '../dto/user-room-update.dto';

export interface RoomGatewayResponseEventInterface {
  'room/connectUser': (roomUser: UserRoomUpdateDto) => void;
  'room/disconnectUser': (roomUser: UserRoomUpdateDto) => void;
}
