import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { JwtWsStrategy } from './jwt-ws.strategy';
import { UserModule } from '../user/user.module';

@Module({
  providers: [WsGateway, JwtWsStrategy],
  imports: [UserModule],
})
export class WsModule {}
