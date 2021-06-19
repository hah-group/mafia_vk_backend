import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { GATEWAY_SETTINGS } from '../gateway-settings';
import { UseFilters, UseGuards } from '@nestjs/common';
import { HttpGatewayFilter } from '../http-gateway.filter';
import { StatusResponseDto } from '../dto/status-response.dto';
import { JwtGatewayGuard } from './jwt-gateway.guard';

@WebSocketGateway(GATEWAY_SETTINGS)
@UseFilters(new HttpGatewayFilter())
export class AuthGateway {
  @SubscribeMessage('AUTH_LOGIN')
  @UseGuards(JwtGatewayGuard)
  login(): StatusResponseDto {
    return {
      status: true,
    };
  }
}
