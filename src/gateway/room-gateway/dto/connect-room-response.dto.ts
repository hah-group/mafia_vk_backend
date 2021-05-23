import { StatusResponseDto } from '../../dto/status-response.dto';
import { PublicRoomType } from '../type/public-room.type';

export class ConnectRoomResponseDto extends StatusResponseDto {
  data: {
    Room: PublicRoomType;
  };
}
