import { GameEntity } from './game.entity';
import { PlayerEntity } from './player.entity';
import { GameRole } from './game-role.interface';

const players: PlayerEntity[] = [
  new PlayerEntity(1),
  new PlayerEntity(2),
  new PlayerEntity(3),
  new PlayerEntity(4),
  new PlayerEntity(5),
  new PlayerEntity(6),
  new PlayerEntity(7),
  new PlayerEntity(8),
  new PlayerEntity(9),
  new PlayerEntity(10),
  new PlayerEntity(11),
  new PlayerEntity(12),
];

const gameRoles: GameRole[] = [
  {
    id: 'MAFIA',
    quantity: 5,
  },
];

describe('GameEntity', () => {
  it('should be defined', () => {
    expect(new GameEntity(players, gameRoles)).toBeDefined();
  });
});
