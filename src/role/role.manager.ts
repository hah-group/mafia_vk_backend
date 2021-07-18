import { IRoleBase } from './role-base.interface';
import { MafiaRole } from './mafia.role';
import { GameRole } from '../game/game-role.interface';
import { PlayerEntity } from '../game/player.entity';

export class RoleManager {
  static match(id: string): IRoleBase | undefined {
    switch (id) {
      case 'MAFIA':
        return new MafiaRole();
    }

    return undefined;
  }

  public static distributeRoles(
    gameRoles: GameRole[],
    players: PlayerEntity[],
  ): PlayerEntity[] {
    let roles: IRoleBase[] = this.getRoles(gameRoles);
    roles.push(
      ...Array<undefined>(players.length - roles.length).fill(undefined),
    );
    roles = this.shuffle(roles);
    players.forEach((player, index) => {
      player.role = roles[index];
    });
    return players;
  }

  private static getRoles(gameRoles: GameRole[]): IRoleBase[] {
    const roles: IRoleBase[] = [];
    gameRoles.forEach((role) => {
      roles.push(
        ...Array<IRoleBase>(role.quantity).fill(RoleManager.match(role.id)),
      );
    });
    return roles;
  }

  //https://bost.ocks.org/mike/shuffle/
  private static shuffle(array: any[]): any[] {
    let m = array.length,
      t,
      i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }
}
