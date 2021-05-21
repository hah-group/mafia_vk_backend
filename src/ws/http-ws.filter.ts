import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { BaseWsException } from './exception/base-ws.exception';
import { Socket } from 'socket.io';

@Catch(HttpException)
export class HttpWsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const error = new BaseWsException(
      exception.message,
      exception.getStatus(),
    ).getError();
    const socket = host.switchToWs().getClient<Socket>();
    socket.emit('exception', error);
  }
}
