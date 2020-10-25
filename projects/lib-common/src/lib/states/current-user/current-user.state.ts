import { State, Action, StateContext, Selector, Store } from "@ngxs/store";
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { first, get, pick } from 'lodash';
import { Auth } from '../auth';
import { CurrentUser } from './current-user.action';
import { CurrentUserStateModel } from './current-user.interfaces';

@State<CurrentUserStateModel>({
  name: 'currentUser',
  defaults: {
    id:        null,
    email:     null,
    firstname: null,
    lastname:  null,
  }
})
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
  ) { }

  @Action(CurrentUser.Fetch)
  fetch(ctx: StateContext<CurrentUserStateModel>) {
    // temporary until `/sessions/me` from real API
    const email = get(this.store.snapshot(), 'auth.email');
    const request = this.http.get(`/api/640/users?email=${email}`)
      .pipe(
        map(users => first(users)),
        map(user => pick(user, ['id','email','firstname','lastname'])),
        tap(user => ctx.patchState(user)),
        catchError(() => this.store.dispatch(new Auth.Logout())),
      );

    // does not exist; fetch the current user
    if (email && !ctx.getState().id) {
      return new Promise(resolve => request.subscribe(() => resolve()));
    }
    // does exist; update behind the scenes
    else if(email) {
      request.subscribe();
    }
  }

  @Action(CurrentUser.Clear)
  clear(ctx: StateContext<CurrentUserStateModel>) {
    ctx.patchState({
      id:        null,
      email:     null,
      firstname: null,
      lastname:  null,
    });
  }
}
