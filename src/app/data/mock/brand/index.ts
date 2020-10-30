import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { AuthService } from './../../../core/auth/auth.service';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';
import { CurrentMembershipState } from '@libCommon';

@Injectable({
  providedIn: 'root'
})
export class BrandMockApi implements TreoMockApi {
  
  constructor(
    private _store: Store,
    private _http: HttpClient,
    private _authService: AuthService,
    private _treoMockApiService: TreoMockApiService
  ) {
    this.register();
  }

  register(): void {
    /**
     * GET /brands
     */
    this._treoMockApiService
      .onGet( "/api/brands" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const membershipId = this._store.selectSnapshot( CurrentMembershipState.id );
        return this._http.get<any[]>( `/mock-api/memberships/${ membershipId }/brands` )
          .pipe(
            map(brands => brands.map(({ brand }) => brand)),
            map(brands => [ 200, brands ]),
          );
      });
    
    /**
     * PATCH /brands/:brandId
     */
    this._treoMockApiService
      .onPatch( "/api/brands/:brandId" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const accountId = this._store.selectSnapshot( CurrentMembershipState.accountId );
        Object.assign(request.body, { accountId });
        
        const brandId = request.params.get( 'brandId' );
        request.body.id = brandId;
        return this._http.patch( `/mock-api/brands/${ brandId }`, request.body )
          .pipe(map(brand => [ 200, brand ]));
      });

    /**
     * DELETE /brands/:brandId
     */
    this._treoMockApiService
      .onDelete( "/api/brands/:brandId" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const brandId = request.params.get( 'brandId' );
        return this._http.delete( `/mock-api/brands/${ brandId }` )
          .pipe(map(() => [ 200 ]));
      });
  }
}
