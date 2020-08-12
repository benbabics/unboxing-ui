import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';

@Injectable()
export class AuthService {
  private _authenticated: boolean;

  constructor(
    private _httpClient: HttpClient
  ) {
    this._authenticated = false;
  }

  set accessToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  get accessToken(): string {
    return localStorage.getItem('access_token');
  }

  signIn(credentials: { email: string, password: string }): Observable<any> {
    if ( this._authenticated ) {
      return throwError('User is already logged in.');
    }

    return this._httpClient.post('api/auth/sign-in', credentials).pipe(
      switchMap((response: any) => {
        this.accessToken = response.access_token;
        this._authenticated = true;
        return of(response);
      })
    );
  }

  signInUsingToken(): Observable<any> {
    return this._httpClient.post('api/auth/refresh-access-token', {
      access_token: this.accessToken
    })
    .pipe(
      catchError(() => of(false)),
      switchMap((response: any) => {
        this.accessToken = response.access_token;
        this._authenticated = true;
        return of(true);
      })
    );
  }

  signOut(): Observable<any> {
    localStorage.removeItem('access_token');
    this._authenticated = false;
    return of(true);
  }

  check(): Observable<boolean> {
    if ( this._authenticated ) {
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
