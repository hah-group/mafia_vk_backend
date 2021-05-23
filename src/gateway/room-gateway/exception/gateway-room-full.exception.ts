import { BaseGatewayException } from '../../exception/base-gateway.exception';
import { GatewayExceptionCodeEnum } from '../../exception/gateway-exception-code.enum';

export class GatewayRoomFullException extends BaseGatewayException {
  constructor() {
    super('Room full, connection rejected', GatewayExceptionCodeEnum.ROOM_FULL);
  }
}
