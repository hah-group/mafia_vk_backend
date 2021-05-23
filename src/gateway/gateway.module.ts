import { Module } from '@nestjs/common';
import { PublicGatewayModule } from './public-gateway/public-gateway.module';
import { RoomGatewayModule } from './room-gateway/room-gateway.module';
import { UserGatewayModule } from './user-gateway/user-gateway.module';

@Module({
  providers: [],
  imports: [PublicGatewayModule, RoomGatewayModule, UserGatewayModule],
})
export class GatewayModule {}
