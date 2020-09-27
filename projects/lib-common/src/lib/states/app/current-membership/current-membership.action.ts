import { Account } from '../../account';
import { MembershipRole } from './current-membership.interfaces';

export interface CurrentMembership {
  id: string;
  role: MembershipRole;
  account: Account;
}

export namespace CurrentMembership {

  export class Refresh {
    static readonly type = '[CurrentMembership API] Refresh';
  }
  
  export class Select {
    static readonly type = '[CurrentMembership] Select';
    constructor(public payload: CurrentMembership) { }
  }

  export class Clear {
    static readonly type = '[CurrentMembership] Clear';
  }
}
