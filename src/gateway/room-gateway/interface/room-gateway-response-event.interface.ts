import { PublicRoomType } from '../type/public-room.type';

export interface RoomGatewayResponseEventInterface {
  ROOM_UPDATE: (roomUser: PublicRoomType) => void;
}
