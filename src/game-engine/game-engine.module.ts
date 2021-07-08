import { Module } from '@nestjs/common';
import { GameEngineService } from './game-engine.service';

@Module({
  providers: [GameEngineService],
})
export class GameEngineModule {}
