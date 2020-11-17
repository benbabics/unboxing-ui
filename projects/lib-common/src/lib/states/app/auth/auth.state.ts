import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Action, StateContext, Selector } from "@ngxs/store";
import { map, tap } from 'rxjs/operators';
import { Auth } from './auth.action';

export interface AuthStateModel extends Auth { }


@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: null,
    email: null,
    rememberMe: false,
  }
})
@Injectable()
export class AuthState {

  @Selector()
  static details(state: AuthStateModel) {
    return state;
  }
  
  @Selector()
  static email(state: AuthStateModel): string | null {
    return state.email;
  }
  
  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return !!state.token;
  }

  constructor(
    private _http: HttpClient,
  ) { }

  @Action( Auth.Login )
  login(ctx: StateContext<AuthStateModel>, action: Auth.Login) {
    return new Promise((resolve, reject) => {
      const { email, password, rememberMe } = action.payload;
      this._http.post(`/api/signin`, { email, password })
        .pipe(
          map(({ accessToken }: any) => ({ email, token: accessToken })),
          tap((state => ctx.patchState({ ...state, rememberMe }))),
        )
        .subscribe(() => resolve(), err => reject(err));
    })
  }

  @Action( Auth.Logout )
  logout(ctx: StateContext<AuthStateModel>) {
    let state = { token: null };

    if ( !ctx.getState().rememberMe ) {
      state = { ...state, email: null } as any;
    }
    
    ctx.patchState( state );
  }
}
