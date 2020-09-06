import { map } from 'rxjs/operators';
import { AuthService } from './../../../core/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';
import { CurrentUserState } from '../../../../../projects/lib-common/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class AccountMockApi implements TreoMockApi {

  constructor(
    private store: Store,
    private http: HttpClient,
    private authService: AuthService,
    private treoMockApiService: TreoMockApiService
  ) {
    this.register();
  }

  register(): void {
    /**
     * GET /accounts
     */
    this.treoMockApiService
      .onGet( "/api/accounts", 1500 )
      .reply(request => {
        if ( !this.authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const userId = this.store.selectSnapshot( CurrentUserState.userId );
        return this.http.get( `/mock-api/640/accounts?userId=${ userId }` )
          .pipe(map(accounts => [ 200, accounts ]));
      });

    /**
     * GET /accounts/:accountId
     */
    this.treoMockApiService
      .onGet( "/api/accounts/:accountId" )
      .reply(request => {
        if ( !this.authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const accountId = request.params.get( 'accountId' );
        return this.http.get( `/mock-api/accounts/${ accountId }`, { params: request.params } )
          .pipe(map(account => [ 200, account ]));
      });

    /**
     * POST /accounts/:accountId/brands
     */
    this.treoMockApiService
      .onPost( "/api/accounts/:accountId/brands" )
      .reply(request => {
        if ( !this.authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const accountId = request.params.get( 'accountId' );
        return this.http.post( `/mock-api/accounts/${ accountId }/brands`, request.body)
          .pipe(map(brand => [ 200, brand ]));
      });
  }
}
