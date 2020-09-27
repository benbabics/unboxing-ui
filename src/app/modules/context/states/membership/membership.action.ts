import { Membership as MembershipBase } from './../../../../../../projects/lib-common/src/public-api';

export interface Membership extends MembershipBase {}

export namespace Membership {

  export class Index {
    static readonly type = '[Membership API] Index';
  }

  export class Show {
    static readonly type = '[Membership API] Show';
    constructor( public id: string ) { }
  }
}
