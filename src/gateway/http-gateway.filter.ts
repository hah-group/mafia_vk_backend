import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { BaseGatewayException } from './exception/base-gateway.exception';
import { Socket } from 'socket.io';

@Catch(HttpException)
export class HttpGatewayFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const error = new BaseGatewayException(
      exception.message,
      exception.getStatus(),
    ).getError();
    const socket = host.switchToWs().getClient<Socket>();
    socket.emit('EXCEPTION', error);
  }
}
