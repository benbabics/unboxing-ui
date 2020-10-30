import { ProjectMembership } from './membership';
import { ProjectUser } from './user';

export interface ProjectMember extends ProjectMembership {
  user: ProjectUser;
}

export namespace ProjectMember {

  export class Index {
    static readonly type = '[ProjectMember API] Index';
  }
}
