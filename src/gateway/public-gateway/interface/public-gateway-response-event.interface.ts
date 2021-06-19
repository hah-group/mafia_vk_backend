import { PublicRoomType } from '../../room-gateway/type/public-room.type';

export interface PublicGatewayResponseEventInterface {
  PUBLIC_ROOM_CREATE: (room: PublicRoomType) => void;
  PUBLIC_ROOM_UPDATE: (room: PublicRoomType) => void;
}
