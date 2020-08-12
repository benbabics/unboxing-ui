import { State, Action, StateContext, Selector } from "@ngxs/store";
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { AuthStateModel } from './auth.interfaces';
import { Auth } from './auth.action';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: null,
    email: null,
  }
})
export class AuthState {

  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return !!state.token;
  }

  constructor(private http: HttpClient) { }

  @Action(Auth.Login)
  login(ctx: StateContext<AuthStateModel>, action: Auth.Login) {
    return new Promise(resolve => {
      const { email, password } = action.payload;
      this.http.post(`/api/signin`, { email, password })
        .pipe(
          map(({ accessToken }: any) => ({ email, token: accessToken })),
          tap((state => ctx.patchState(state))),
        )
        .subscribe(() => resolve());
    })
  }

  @Action(Auth.Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      email: null,
      token: null,
    });
  }
}
