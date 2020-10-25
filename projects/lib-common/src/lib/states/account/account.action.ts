export interface Account {
  id: string;
  title: string;

  // belongs to
  userId: string;

  // has many
  brandIds: string[];
  projectIds: string[];

  // side loaded data
  brands?: any[];
  projects?: any[];
}


export namespace Account {
  export class Index {
    static readonly type = '[Account API] Index';
  }

  export class Show {
    static readonly type = '[Account API] Show';
    constructor(public id: string) { }
  }

  export class Create {
    static readonly type = '[Account API] Create';
    constructor(public payload: Account) { }
  }

  export class Update {
    static readonly type = '[Account API] Update';
    constructor(public payload: Account) { }
  }

  export class Destroy {
    static readonly type = '[Account API] Destroy';
    constructor(public id: string) { }
  }
}
