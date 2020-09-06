import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, State, Action, Selector, StateContext } from '@ngxs/store';
import { defaultEntityState, EntityStateModel, EntityState, IdStrategy, Add, Update, SetLoading, Remove } from '@ngxs-labs/entity-state';
import { UpdateFormDirty } from '@ngxs/form-plugin';
import { finalize, flatMap } from 'rxjs/operators';
import { User } from './user.action';

export interface UserStateModel extends EntityStateModel<User> {
  manageUserForm,
}

@State({
  name: 'user',
  defaults: {
    ...defaultEntityState(),
    manageUserForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    }
  }
})
@Injectable()
export class UserState extends EntityState<User> {

  constructor(
    private store: Store,
    private http: HttpClient,
  ) {
    super( UserState, 'id', IdStrategy.EntityIdGenerator );
  }
}
