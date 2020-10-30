import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store, State, StateContext, Actions, Action } from '@ngxs/store';
import { defaultEntityState, EntityStateModel, EntityState, IdStrategy, ofEntityActionSuccessful, EntityActionType, CreateOrReplace, SetLoading } from '@ngxs-labs/entity-state';
import { User } from './user.action';
import { finalize, flatMap, tap } from 'rxjs/operators';
import { CurrentMembershipState } from '../app';

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
    private _store: Store,
    private _http: HttpClient,
    private _actions$: Actions,
  ) {
    super( UserState, 'id', IdStrategy.EntityIdGenerator );
  }

  @Action( User.SearchQuery )
  search(ctx: StateContext<UserStateModel>, { query }: User.SearchQuery) {
    this.toggleLoading( true );

    let params = new HttpParams();
    params = params.append( 'q', query );

    return this._store.selectOnce( CurrentMembershipState.accountId )
      .pipe(
        flatMap(id => this._http.get<User[]>( `/api/accounts/${ id }/users`, { params } )),
        tap(users => ctx.dispatch( new User.SearchResults(users) )),
        finalize(() => this.toggleLoading( false )),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this._store.dispatch( new SetLoading(UserState, isLoading) );
  }
}
