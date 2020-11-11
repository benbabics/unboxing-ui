import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { AuthService } from './../../../core/auth/auth.service';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectAssetDirectoryMockApi implements TreoMockApi {
  
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
     * POST /assetDirectories
     */
    this._treoMockApiService
      .onPost( "/api/assetDirectories" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        return this._http.post( `/mock-api/assetDirectories`, request.body )
          .pipe(map(assetDirectory => [ 200, assetDirectory ]));
      });

    /**
     * PATCH /assetDirectories/:assetDirectoryId
     */
    this._treoMockApiService
      .onPatch( "/api/assetDirectories/:assetDirectoryId" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const assetDirectoryId = request.params.get( 'assetDirectoryId' );
        return this._http.patch( `/mock-api/assetDirectories/${ assetDirectoryId }`, request.body )
          .pipe(map(assetDirectory => [ 200, assetDirectory ]));
      });

    /**
     * DELETE /assetDirectories/:assetDirectoryId
     */
    this._treoMockApiService
      .onDelete( "/api/assetDirectories/:assetDirectoryId" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const assetDirectoryId = request.params.get( 'assetDirectoryId' );
        return this._http.delete( `/mock-api/assetDirectories/${ assetDirectoryId }` )
          .pipe(map(() => [ 200 ]));
      });
  }
}
