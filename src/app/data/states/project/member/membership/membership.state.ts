import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { CreateOrReplace, defaultEntityState, EntityState, EntityStateModel, IdStrategy, SetLoading } from '@ngxs-labs/entity-state';
import { ProjectMembership } from './membership.action';

export interface ProjectMembershipStateModel extends EntityStateModel<ProjectMembership> {
}

@State<ProjectMembershipStateModel>({
  name: 'projectMembership',
  defaults: {
    ...defaultEntityState()
  }
})
@Injectable()
export class ProjectMembershipState extends EntityState<ProjectMembership> {

  constructor(
    private _store: Store,
    private _http: HttpClient,
  ) {
    super( ProjectMembershipState, "id", IdStrategy.EntityIdGenerator );
  }

  @Action( ProjectMembership.Index )
  crudIndex(ctx: StateContext<ProjectMembershipStateModel>, { projectId }: ProjectMembership.Index) {
    this.toggleLoading( true );

    return this._http.get<ProjectMembership[]>( `/api/projects/${ projectId }/members` )
      .pipe(
        tap(members => ctx.dispatch(new CreateOrReplace(ProjectMembershipState, members) )),
        finalize(() => this.toggleLoading( false )),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this._store.dispatch( new SetLoading(ProjectMembershipState, isLoading) );
  }
}
