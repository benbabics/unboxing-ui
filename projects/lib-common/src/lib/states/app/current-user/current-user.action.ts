export interface CurrentUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  avatar?: string;
}

export namespace CurrentUser {

  export class Refresh {
    static readonly type = '[CurrentUser] Refresh';
  }

  export class Clear {
    static readonly type = '[CurrentUser] Clear';
  }
}
