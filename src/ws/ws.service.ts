import { Injectable, NotImplementedException } from '@nestjs/common';
import { Room } from '@prisma/client';

@Injectable()
export class WsService {
  async roomConnect(room: Room): Promise<void> {
    throw new NotImplementedException();
  }
}
