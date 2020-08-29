import { CreateOrReplace } from '@ngxs-labs/entity-state';
export interface Brand {
  id: string;
  name: string;
  logoUrl: string;

  accountId?: string;
}

export namespace Brand {
  export class Manage {
    static readonly type = '[Brand] Modal Open';
    constructor(public payload?: Brand) { }
  }

  export class Create {
    static readonly type = '[Brand API] Create';
    constructor(public payload: Brand) { }
  }
  
  export class Update {
    static readonly type = '[Brand API] Update';
    constructor(public payload: Brand) { }
  }
}