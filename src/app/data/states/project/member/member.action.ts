import { MembershipRole } from '../../app';
import { User } from '../../user';

export interface ProjectMember extends User {
  role: MembershipRole;
}

export namespace ProjectMember {

  export class Index {
    static readonly type = '[ProjectMember API] Index';
    constructor( public projectId: string ) { }
  }
}
