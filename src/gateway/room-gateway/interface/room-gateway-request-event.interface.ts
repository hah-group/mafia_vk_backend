export interface RoomGatewayRequestEventInterface {
  'room/connect': () => void;
  'room/disconnect': () => void;
}
