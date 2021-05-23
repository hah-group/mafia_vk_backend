import { Module } from '@nestjs/common';
import { PublicGateway } from './public.gateway';
import { JwtGatewayStrategy } from '../guard/jwt-gateway.strategy';
import { UserModule } from '../../user/user.module';

@Module({
  providers: [PublicGateway, JwtGatewayStrategy],
  imports: [UserModule],
})
export class PublicGatewayModule {}
