import { WsException } from '@nestjs/websockets';
import { BaseWsExceptionBodyInterface } from './base-ws-exception-body.interface';
import { WsExceptionCodeEnum } from './ws-exception-code.enum';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

export class BaseWsException extends WsException {
  private readonly code: WsExceptionCodeEnum;

  constructor(message: string, code: WsExceptionCodeEnum | HttpStatus) {
    super(message);
    this.code = code;
  }

  getError(): BaseWsExceptionBodyInterface {
    return {
      message: this.message,
      code: this.code,
    };
  }

  getCode(): WsExceptionCodeEnum | HttpStatus {
    return this.code;
  }
}
