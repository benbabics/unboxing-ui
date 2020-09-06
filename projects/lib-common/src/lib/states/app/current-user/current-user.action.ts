import { User } from './../../user/user.action';

export interface CurrentUser extends User {
}

export namespace CurrentUser {

  export class Refresh {
    static readonly type = '[CurrentUser API] Refresh';
  }

  export class Update {
    static readonly type = '[CurrentUser API] Update';
    constructor( public payload: Partial<CurrentUser> ) { }
  }

  export class Clear {
    static readonly type = '[CurrentUser] Clear';
  }
}
