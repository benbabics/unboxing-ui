import { Account } from '../../account';

export type MembershipRole = keyof {
  "SUPER_ADMIN", "ADMIN", "CONTRIBUTOR", "USER", "GUEST",
}
export namespace MembershipRole {
  export const SuperAdmin: MembershipRole  = "SUPER_ADMIN";
  export const Admin: MembershipRole       = "ADMIN";
  export const Contributor: MembershipRole = "CONTRIBUTOR";
  export const User: MembershipRole        = "USER";
  export const Guest: MembershipRole       = "GUEST";
}

export interface Membership {
  id: string;
  role: MembershipRole;
  account: Account;
}
