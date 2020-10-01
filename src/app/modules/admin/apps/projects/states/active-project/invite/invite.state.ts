import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { Add, CreateOrReplace, defaultEntityState, EntityState, EntityStateModel, IdStrategy, Remove, SetLoading, Update } from '@ngxs-labs/entity-state';
import { finalize, flatMap, tap } from 'rxjs/operators';
import { ActiveProjectInvite } from './invite.action';

export interface ActiveProjectInviteStateModel extends EntityStateModel<ActiveProjectInvite> {
}

@State<ActiveProjectInviteStateModel>({
  name: 'invite',
  defaults: {
    ...defaultEntityState()
  }
})
@Injectable()
export class ActiveProjectInviteState extends EntityState<ActiveProjectInvite> {

  constructor(
    private _store: Store,
    private _http: HttpClient,
  ) {
    super( ActiveProjectInviteState, 'id', IdStrategy.EntityIdGenerator );
  }

  @Action( ActiveProjectInvite.Index )
  crudIndex(ctx: StateContext<ActiveProjectInviteStateModel>, { projectId }: ActiveProjectInvite.Index) {
    this.toggleLoading( true );

    return this._http.get<ActiveProjectInvite[]>( `/api/projects/${ projectId }/invitations` )
      .pipe(
        tap(invites => ctx.dispatch( new CreateOrReplace(ActiveProjectInviteState, invites) )),
        finalize(() => this.toggleLoading( false )),
      );
  }

  @Action( ActiveProjectInvite.Create )
  crudCreate(ctx: StateContext<ActiveProjectInviteStateModel>, { payload }: ActiveProjectInvite.Create) {
    this.toggleLoading( true );

    return this._http.post<ActiveProjectInvite>( `/api/projects/${ payload.projectId }/invitations`, payload )
      .pipe(
        flatMap(invite => ctx.dispatch( new Add(ActiveProjectInviteState, invite) )),
        finalize(() => this.toggleLoading( false )),
      );
  }

  @Action( ActiveProjectInvite.Update )
  crudUpdate(ctx: StateContext<ActiveProjectInviteStateModel>, { payload }: ActiveProjectInvite.Update) {
    this.toggleLoading( true );

    return this._http.put<ActiveProjectInvite>( `/api/invitations/${ payload.id }`, payload )
      .pipe(
        flatMap(invite => ctx.dispatch( new Update(ActiveProjectInviteState, invite.id, invite) )),
        finalize(() => this.toggleLoading( false )),
      );
  }

  @Action( ActiveProjectInvite.Destroy )
  crudDestroy(ctx: StateContext<ActiveProjectInviteStateModel>, { id }: ActiveProjectInvite.Destroy) {
    this.toggleLoading( true );

    return this._http.delete( `/api/invitations/${ id }` )
      .pipe(
        flatMap(() => ctx.dispatch( new Remove(ActiveProjectInviteState, id) )),
        finalize(() => this.toggleLoading( false )),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this._store.dispatch( new SetLoading(ActiveProjectInviteState, isLoading) );
  }
}
