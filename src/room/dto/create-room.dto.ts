import { RoomTypeEnum } from '../enum/room-type.enum';
import { IsEnum, IsNumber, Max, Min } from 'class-validator';

export class CreateRoomDto {
  @IsEnum(RoomTypeEnum)
  type: RoomTypeEnum;

  @IsNumber()
  @Min(5)
  @Max(16)
  size: number;
}
