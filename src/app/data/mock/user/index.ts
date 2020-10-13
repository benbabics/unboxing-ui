import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { chain, isString, omit, values } from 'lodash';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';
import { User } from '../../../../../projects/lib-common/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class ProjectUserMockApi implements TreoMockApi {
  
  constructor(
    private _store: Store,
    private _http: HttpClient,
    private _authService: AuthService,
    private _treoMockApiService: TreoMockApiService,
  ) {
    this.register();
  }

  register(): void {
    /**
     * GET /accounts/:accountId/users?q
     */
    this._treoMockApiService
      .onGet( "/api/accounts/:accountId/users" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const query     = request.params.get( 'q' );
        const accountId = request.params.get( 'accountId' );

        let params = new HttpParams();
        params = params.append( '_expand', 'user' );
        
        return this._http.get<User[]>( `/mock-api/accounts/${ accountId }/memberships`, { params } )
          .pipe(
            map(members => members.map(({ role, user }: any) => ({ role, ...omit(user, [ 'password' ]) }))),
            map(users => users.filter(user => 
              chain(user)
                .values()
                .filter(val => isString(val) && isString(query))
                .map(val => val.toLowerCase())
                .some(item => item.includes(query.toLowerCase()))
                .value()
            )),
            map(users => [ 200, users ]),
          );
      });
  }
}
