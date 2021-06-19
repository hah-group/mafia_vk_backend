import { Module } from '@nestjs/common';
import { PublicGateway } from './public.gateway';
import { UserModule } from '../../user/user.module';

@Module({
  providers: [PublicGateway],
  imports: [UserModule],
})
export class PublicGatewayModule {}
