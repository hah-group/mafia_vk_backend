import { ReadyUserDto } from '../dto/ready-user.dto';

export interface UserGatewayResponseEventInterface {
  'user/ready': (data: ReadyUserDto) => void;
}
