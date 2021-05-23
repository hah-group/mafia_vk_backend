import { WsException } from '@nestjs/websockets';
import { BaseGatewayExceptionBodyInterface } from './base-gateway-exception-body.interface';
import { GatewayExceptionCodeEnum } from './gateway-exception-code.enum';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

export class BaseGatewayException extends WsException {
  private readonly code: GatewayExceptionCodeEnum | HttpStatus;

  constructor(message: string, code: GatewayExceptionCodeEnum | HttpStatus) {
    super(message);
    this.code = code;
  }

  getError(): BaseGatewayExceptionBodyInterface {
    return {
      message: this.message,
      code: this.code,
    };
  }

  getCode(): GatewayExceptionCodeEnum | HttpStatus {
    return this.code;
  }
}
