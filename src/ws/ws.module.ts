import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { JwtWsStrategy } from './guard/jwt-ws.strategy';
import { UserModule } from '../user/user.module';
import { WsService } from './ws.service';

@Module({
  providers: [WsGateway, JwtWsStrategy, WsService],
  imports: [UserModule],
})
export class WsModule {}
