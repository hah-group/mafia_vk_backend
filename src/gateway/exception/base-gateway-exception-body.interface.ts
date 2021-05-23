import { GatewayExceptionCodeEnum } from './gateway-exception-code.enum';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

export interface BaseGatewayExceptionBodyInterface {
  message: string;
  code: GatewayExceptionCodeEnum | HttpStatus;
}
