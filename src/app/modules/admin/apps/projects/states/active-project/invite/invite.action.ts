export interface ActiveProjectInvite {
  id: string;
  token: string;
  email: string;
  senderId: string;
  recipientId: string;
  projectId: string;
}

export namespace ActiveProjectInvite {

  export class Index {
    static readonly type = '[ActiveProjectInvite API] Index';
    constructor( public projectId: string ) { }
  }

  export class Create {
    static readonly type = '[ActiveProjectInvite API] Create';
    constructor( public payload: ActiveProjectInvite ) { }
  }

  export class Update {
    static readonly type = '[ActiveProjectInvite API] Update';
    constructor( public payload: ActiveProjectInvite ) { }
  }

  export class Destroy {
    static readonly type = '[ActiveProjectInvite API] Destroy';
    constructor( public id: string ) { }
  }
}
