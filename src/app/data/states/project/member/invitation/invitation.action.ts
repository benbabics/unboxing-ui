import { MembershipRole } from '../../../';

export interface ProjectInvitation {
  id: string;
  token: string;
  email: string;
  senderId: string;
  recipientId: string;
  projectId: string;
  role: MembershipRole;
}

export namespace ProjectInvitation {

  export class Index {
    static readonly type = '[ProjectInvitation API] Index';
    constructor( public projectId: string ) { }
  }

  export class Create {
    static readonly type = '[ProjectInvitation API] Create';
    constructor( public projectId: string, public email: string ) { }
  }

  export class Update {
    static readonly type = '[ProjectInvitation API] Update';
    constructor( public payload: ProjectInvitation ) { }
  }

  export class Destroy {
    static readonly type = '[ProjectInvitation API] Destroy';
    constructor( public id: string ) { }
  }
}
