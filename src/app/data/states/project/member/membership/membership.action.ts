import { MembershipRole } from '../../../app';
import { User } from '../../../user';

export interface ProjectMembership extends User {
  role: MembershipRole;
}

export namespace ProjectMembership {

  export class Index {
    static readonly type = '[ProjectMembership API] Index';
    constructor( public projectId: string ) { }
  }
}
