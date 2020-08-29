import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Action, StateContext, Selector, Store } from "@ngxs/store";
import { tap, catchError } from 'rxjs/operators';
import { CurrentUser } from './current-user.action';
import { Auth } from '../auth';
import { AuthService } from 'app/core/auth/auth.service';

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
    private store: Store,
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  @Action(CurrentUser.Refresh)
  refresh(ctx: StateContext<CurrentUserStateModel>) {
    if ( !this.authService.isAuthenticated ) return Promise.resolve();

    return this.http.get(`/api/sessions/me`)
      .pipe(
        tap(user => ctx.patchState( user )),
        catchError(() => this.store.dispatch( new Auth.Logout() )),
      );
  }

  @Action(CurrentUser.Clear)
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
