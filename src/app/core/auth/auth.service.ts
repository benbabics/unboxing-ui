import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, of, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { Auth, AuthState, CurrentUser } from '../../../../projects/lib-common/src/public-api';

@Injectable()
export class AuthService {

  constructor(
    private store: Store,
  ) { }

  get accessToken(): string {
    return this.store.selectSnapshot(AuthState.token);
  }

  get isAuthenticated(): boolean {
    return this.store.selectSnapshot(AuthState.isAuthenticated);
  }

  signIn(credentials: { email: string, password: string }): Observable<any> {
    if (this.isAuthenticated ) {
      return throwError('User is already logged in.');
    }

    return this.store.dispatch( new Auth.Login(credentials) );
  }

  signInUsingToken(): Observable<any> {
    return this.store.dispatch( new CurrentUser.Refresh() );
  }

  signOut(): Observable<any> {
    return this.store.dispatch( new Auth.Logout() );
  }

  check(): Observable<boolean> {
    if ( this.isAuthenticated ) {
      return of(true);
    }

    if ( !this.accessToken ) {
      return of(false);
    }

    if ( AuthUtils.isTokenExpired(this.accessToken) ) {
      return of(false);
    }

    return this.signInUsingToken();
  }
}
