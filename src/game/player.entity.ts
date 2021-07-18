import { IRoleBase } from '../role/role-base.interface';

export class PlayerEntity {
  private readonly _id: number;

  constructor(id: number) {
    this._id = id;
  }

  private _role: IRoleBase;

  public get role() {
    return this._role;
  }

  public set role(baseRole) {
    this._role = baseRole;
  }

  public get id() {
    return this._id;
  }
}
