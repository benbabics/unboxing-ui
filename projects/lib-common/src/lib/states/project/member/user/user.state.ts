import { Injectable } from '@angular/core';
import { State, Store } from '@ngxs/store';
import { defaultEntityState, EntityState, EntityStateModel, IdStrategy } from '@ngxs-labs/entity-state';
import { ProjectUser } from './user.action';

export interface ProjectUserStateModel extends EntityStateModel<ProjectUser> { }

@State<ProjectUserStateModel>({
  name: 'projectUser',
  defaults: {
    ...defaultEntityState(),
  }
})
@Injectable()
export class ProjectUserState extends EntityState<ProjectUser> {

  constructor(
    private _store: Store,
  ) {
    super( ProjectUserState, "id", IdStrategy.EntityIdGenerator );
  }
}
