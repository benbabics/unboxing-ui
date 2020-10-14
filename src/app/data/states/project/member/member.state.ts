import { Injectable } from '@angular/core';
import { State, Store } from '@ngxs/store';
import { ProjectMembershipState } from './membership';
import { ProjectInvitationState } from './invitation';
import { ProjectUserState } from './user';

export interface ProjectMemberStateModel {
}

@State<ProjectMemberStateModel>({
  name: 'projectMember',
  defaults: {},
  children: [
    ProjectInvitationState,
    ProjectMembershipState,
    ProjectUserState,
  ]
})
@Injectable()
export class ProjectMemberState {

  constructor(
    private _store: Store,
  ) {
  }
}
