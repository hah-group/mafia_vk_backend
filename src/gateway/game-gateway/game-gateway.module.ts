import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameGatewayService } from './game-gateway.service';
import { SizeRuleModule } from '../../size-rule/size-rule.module';
import { RoomModule } from '../../room/room.module';

@Module({
  providers: [GameGateway, GameGatewayService],
  imports: [SizeRuleModule, RoomModule],
  exports: [GameGatewayService],
})
export class GameGatewayModule {}
