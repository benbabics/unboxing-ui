import { MembershipRole } from '../../../app';

export interface ProjectMembership {
  id: string;
  accountId: string;
  userId: string;
  role: MembershipRole;
}

export namespace ProjectMembership {
}
