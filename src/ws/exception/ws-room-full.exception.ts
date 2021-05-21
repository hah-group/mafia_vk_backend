import { BaseWsException } from './base-ws.exception';
import { WsExceptionCodeEnum } from './ws-exception-code.enum';

export class WsRoomFullException extends BaseWsException {
  constructor() {
    super('Room full, connection rejected', WsExceptionCodeEnum.ROOM_FULL);
  }
}
