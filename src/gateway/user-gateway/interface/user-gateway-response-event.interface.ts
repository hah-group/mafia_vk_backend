import { Role } from '@prisma/client';
import { ReadyUserDto } from '../dto/ready-user.dto';

export interface UserGatewayResponseEventInterface {
  USER_READY: (data: ReadyUserDto) => void;
  USER_ROLE_DATA: (role: Role) => void;
}
