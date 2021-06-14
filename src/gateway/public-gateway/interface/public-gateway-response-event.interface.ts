import { PublicRoomType } from '../../room-gateway/type/public-room.type';

export interface PublicGatewayResponseEventInterface {
  'public/event/room/create': (room: PublicRoomType) => void;
  'public/event/room/update': (room: PublicRoomType) => void;
}
