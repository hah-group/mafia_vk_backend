import { Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';

@Injectable()
export class GameEngineService {
  onGameReady(room: Room) {}
}
