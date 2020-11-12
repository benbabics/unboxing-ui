import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { AuthService } from './../../../core/auth/auth.service';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectAssetElementMockApi implements TreoMockApi {

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
     * POST /assetElements
     */
    this._treoMockApiService
      .onPost( "/api/assetElements" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        return this._http.post( `/mock-api/assetElements`, request.body )
          .pipe(map(assetDirectory => [ 200, assetDirectory ]));
      });

    /**
     * PATCH /assetElements/:assetElementId
     */
    this._treoMockApiService
      .onPatch( "/api/assetElements/:assetElementId" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const assetElementId = request.params.get( 'assetElementId' );
        return this._http.patch( `/mock-api/assetElements/${ assetElementId }`, request.body )
          .pipe(map(assetDirectory => [ 200, assetDirectory ]));
      });

    /**
     * DELETE /assetElements/:assetElementId
     */
    this._treoMockApiService
      .onDelete( "/api/assetElements/:assetElementId" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const assetElementId = request.params.get( 'assetElementId' );
        return of('')
          .pipe(map(() => [ 200 ]));
      });
  }
}
