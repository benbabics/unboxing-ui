import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { Add, CreateOrReplace, defaultEntityState, EntityState, EntityStateModel, IdStrategy, Remove, SetLoading, Update } from '@ngxs-labs/entity-state';
import { finalize, flatMap, tap } from 'rxjs/operators';
import { ProjectInvitation } from './invitation.action';

export interface ProjectInvitationStateModel extends EntityStateModel<ProjectInvitation> {
}

@State<ProjectInvitationStateModel>({
  name: 'projectInvitation',
  defaults: {
    ...defaultEntityState()
  }
})
@Injectable()
export class ProjectInvitationState extends EntityState<ProjectInvitation> {

  constructor(
    private _store: Store,
    private _http: HttpClient,
  ) {
    super( ProjectInvitationState, 'id', IdStrategy.EntityIdGenerator );
  }

  @Action( ProjectInvitation.Index )
  crudIndex(ctx: StateContext<ProjectInvitationStateModel>, { projectId }: ProjectInvitation.Index) {
    this.toggleLoading( true );

    return this._http.get<ProjectInvitation[]>( `/api/projects/${ projectId }/invitations` )
      .pipe(
        tap(invites => ctx.dispatch( new CreateOrReplace(ProjectInvitationState, invites) )),
        finalize(() => this.toggleLoading( false )),
      );
  }

  @Action( ProjectInvitation.Create )
  crudCreate(ctx: StateContext<ProjectInvitationStateModel>, payload: ProjectInvitation.Create) {
    this.toggleLoading( true );

    return this._http.post<ProjectInvitation>( `/api/projects/${ payload.projectId }/invitations`, payload )
      .pipe(
        flatMap(invite => ctx.dispatch( new Add(ProjectInvitationState, invite) )),
        finalize(() => this.toggleLoading( false )),
      );
  }

  @Action( ProjectInvitation.Update )
  crudUpdate(ctx: StateContext<ProjectInvitationStateModel>, { payload }: ProjectInvitation.Update) {
    this.toggleLoading( true );

    return this._http.put<ProjectInvitation>( `/api/invitations/${ payload.id }`, payload )
      .pipe(
        flatMap(invite => ctx.dispatch( new Update(ProjectInvitationState, invite.id, invite) )),
        finalize(() => this.toggleLoading( false )),
      );
  }

  @Action( ProjectInvitation.Destroy )
  crudDestroy(ctx: StateContext<ProjectInvitationStateModel>, { id }: ProjectInvitation.Destroy) {
    this.toggleLoading( true );

    return this._http.delete( `/api/invitations/${ id }` )
      .pipe(
        flatMap(() => ctx.dispatch( new Remove(ProjectInvitationState, id) )),
        finalize(() => this.toggleLoading( false )),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this._store.dispatch( new SetLoading(ProjectInvitationState, isLoading) );
  }
}
