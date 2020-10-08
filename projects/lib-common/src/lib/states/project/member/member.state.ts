import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { CreateOrReplace, defaultEntityState, EntityState, EntityStateModel, IdStrategy, SetLoading } from '@ngxs-labs/entity-state';
import { ProjectMember } from './member.action';
import { finalize, tap } from 'rxjs/operators';

export interface ProjectMemberStateModel extends EntityStateModel<ProjectMember> {
}

@State<ProjectMemberStateModel>({
  name: 'member',
  defaults: {
    ...defaultEntityState()
  }
})
@Injectable()
export class ProjectMemberState extends EntityState<ProjectMember> {

  constructor(
    private _store: Store,
    private _http: HttpClient,
  ) {
    super( ProjectMemberState, 'id', IdStrategy.EntityIdGenerator );
  }

  @Action( ProjectMember.Index )
  crudIndex(ctx: StateContext<ProjectMemberStateModel>, { projectId }: ProjectMember.Index) {
    this.toggleLoading( true );

    return this._http.get<ProjectMember[]>( `/api/projects/${ projectId }/members` )
      .pipe(
        tap(members => ctx.dispatch(new CreateOrReplace(ProjectMemberState, members) )),
        finalize(() => this.toggleLoading( false )),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this._store.dispatch( new SetLoading(ProjectMemberState, isLoading) );
  }
}
