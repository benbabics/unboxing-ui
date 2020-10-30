import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Action, StateContext, Selector, Store } from "@ngxs/store";
import { tap, catchError } from 'rxjs/operators';
import { CurrentUser } from './current-user.action';
import { Auth, AuthState } from '../auth';

export interface CurrentUserStateModel extends CurrentUser { }

@State<CurrentUserStateModel>({
  name: 'currentUser',
  defaults: {
    id:        null,
    email:     null,
    firstname: null,
    lastname:  null,
    avatar:    null,
  }
})
@Injectable()
export class CurrentUserState {

  @Selector()
  static userId(state: CurrentUserStateModel) {
    return state.id;
  }
  
  @Selector()
  static details(state: CurrentUserStateModel) {
    return state;
  }

  constructor(
    private _store: Store,
    private _http: HttpClient,
  ) { }

  @Action( CurrentUser.Refresh )
  refresh(ctx: StateContext<CurrentUserStateModel>) {
    const isAuthenticated = this._store.selectSnapshot( AuthState.isAuthenticated );
    if ( !isAuthenticated ) return Promise.resolve();

    return this._http.get( `/api/sessions/me` )
      .pipe(
        tap(user => ctx.patchState( user )),
        catchError(() => ctx.dispatch( new Auth.Logout() )),
      );
  }

  @Action( CurrentUser.Update )
  crudUpdate(ctx: StateContext<CurrentUserStateModel>, { payload }: CurrentUser.Update) {
    return this._http.patch( `/api/sessions/me`, payload )
      .pipe(
        tap(user => ctx.patchState( user )),
      );
  }

  @Action( CurrentUser.Clear )
  clear(ctx: StateContext<CurrentUserStateModel>) {
    ctx.patchState({
      id:        null,
      email:     null,
      firstname: null,
      lastname:  null,
      avatar:    null,
    });
  }
}
