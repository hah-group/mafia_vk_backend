import { BaseGatewayException } from '../../exception/base-gateway.exception';
import { GatewayExceptionCodeEnum } from '../../exception/gateway-exception-code.enum';

export class GatewayRoomUserAlreadyConnectedException extends BaseGatewayException {
  constructor() {
    super(
      'User is already connected to the room, request rejected',
      GatewayExceptionCodeEnum.USER_ALREADY_CONNECTED,
    );
  }
}
