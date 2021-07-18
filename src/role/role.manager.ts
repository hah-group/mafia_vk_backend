import { IRoleBase } from './role-base.interface';
import { MafiaRole } from './mafia.role';

export class RoleManager {
  static match(id: string): IRoleBase | undefined {
    switch (id) {
      case 'MAFIA':
        return new MafiaRole();
    }

    return undefined;
  }
}
