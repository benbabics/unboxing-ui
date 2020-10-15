import { Injectable } from '@angular/core';
import { State, StateContext, Store, Action, Selector } from '@ngxs/store';
import { ProjectMember } from './member.action';
import { ProjectMembership, ProjectMembershipState } from './membership';
import { ProjectInvitationState } from './invitation';
import { ProjectUser, ProjectUserState } from './user';
import { finalize, flatMap, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { omit, values } from 'lodash';
import { CreateOrReplace } from '@ngxs-labs/entity-state';
import { ProjectState } from '../project.state';
import { ProjectActiveState } from '../active';

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

  @Selector([ ProjectMembershipState.entitiesMap, ProjectUserState.entitiesMap ])
  static entities(memberships: ProjectMembership[], users: ProjectUser[]) {
    return values( memberships ).map(membership => ({
      ...membership,
      user: users[ membership.userId ],
    }));
  }
  
  constructor(
    private _store: Store,
    private _http: HttpClient,
  ) { }

  @Action( ProjectMember.Index )
  crudIndex(ctx: StateContext<ProjectMemberStateModel>) {
    this._toggleLoading( true );

    const transformMembers = members => {
      return members.reduce((model, member) => ({
        users: [ ...model.users, member.user ],
        memberships: [ ...model.memberships, omit(member, ['user']) ],
      }), { users: [], memberships: [] });
    }

    return this._store.selectOnce( ProjectActiveState.projectId )
      .pipe(
        flatMap(projectId => this._http.get( `/api/projects/${ projectId }/members` )),
        map(members => transformMembers( members )),
        tap(({ memberships, users }) => ctx.dispatch([
          new CreateOrReplace( ProjectMembershipState, memberships ),
          new CreateOrReplace( ProjectUserState, users ),
        ])),
        finalize(() => this._toggleLoading( false )),
      );
  }

  private _toggleLoading(isLoading: boolean): void {
    // this._store.dispatch( new SetLoading(ProjectMembershipState, isLoading) );
  }
}
