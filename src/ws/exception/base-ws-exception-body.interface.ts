import { WsExceptionCodeEnum } from './ws-exception-code.enum';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

export interface BaseWsExceptionBodyInterface {
  message: string;
  code: WsExceptionCodeEnum | HttpStatus;
}
