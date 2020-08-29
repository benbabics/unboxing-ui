import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { first, set, pick } from 'lodash';
import { Store } from '@ngxs/store';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthState, CurrentUser } from '../../../../../projects/lib-common/src/lib/states';

@Injectable({
  providedIn: 'root'
})
export class AuthMockApi implements TreoMockApi {
  
  constructor(
    private store: Store,
    private http: HttpClient,
    private authService: AuthService,
    private _treoMockApiService: TreoMockApiService
  ) {
    this.register();
  }
  
  register(): void {
    this._treoMockApiService
      .onPost( "/api/signin" )
      .reply((request: any) => {
        const { email, password } = request.body;
        return this.http.post(`/mock-api/signin`, { email, password })
          .pipe(map(response => [ 200, response ]));
      })
    
    this._treoMockApiService
      .onGet( "/api/sessions/me" )
      .reply(request => {
        if ( this.authService.isAuthenticated ) {
          return this.getCurrentUser()
            .pipe(map(user => [ 200, user ]));
        }

        return [ 403, { error: "Forbidden" } ];
      });
  }

  private getCurrentUser(): Observable<CurrentUser> {
    const email = this.store.selectSnapshot( AuthState.email );

    return this.http.get( `/mock-api/640/users?email=${email}` )
      .pipe(
        map((users: any[]) => first( users )),
        map(user => pick(user, [ 'id', 'email', 'firstname', 'lastname', 'avatar' ])),
      );
  }
}
