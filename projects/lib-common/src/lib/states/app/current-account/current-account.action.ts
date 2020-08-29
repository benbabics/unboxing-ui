import { Account } from '../../account';

export interface CurrentAccount extends Partial<Account> {
}

export namespace CurrentAccount {

  export class Select {
    static readonly type = '[CurrentAccount] Select';
    constructor(public payload: CurrentAccount) { }
  }

  export class Refresh {
    static readonly type = '[CurrentAccount API] Refresh';
  }

  export class Clear {
    static readonly type = '[CurrentAccount API] Clear';
  }
}
