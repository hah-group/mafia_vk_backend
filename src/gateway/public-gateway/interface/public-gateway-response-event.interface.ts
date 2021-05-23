import { Room } from '@prisma/client';

export interface PublicGatewayResponseEventInterface {
  'public/event/room/create': (room: Room) => void;
}
