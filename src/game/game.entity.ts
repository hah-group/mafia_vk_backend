import { PlayerEntity } from './player.entity';
import { GameRole } from './game-role.interface';
import { RoleManager } from '../role/role.manager';

export class GameEntity {
  private players: PlayerEntity[];

  constructor(players: PlayerEntity[], gameRoles: GameRole[]) {
    this.players = RoleManager.distributeRoles(gameRoles, players);
  }
}
