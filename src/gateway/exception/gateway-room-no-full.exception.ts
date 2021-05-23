import { BaseGatewayException } from './base-gateway.exception';
import { GatewayExceptionCodeEnum } from './gateway-exception-code.enum';

export class GatewayRoomNoFullException extends BaseGatewayException {
  constructor() {
    super(
      'Not all players connected, request rejected',
      GatewayExceptionCodeEnum.ROOM_NO_FULL,
    );
  }
}
