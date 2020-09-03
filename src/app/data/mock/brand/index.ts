import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { AuthService } from './../../../core/auth/auth.service';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';
import { CurrentAccountState } from './../../../../../projects/lib-common/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class BrandMockApi implements TreoMockApi {
  
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
     * PUT /brands/:brandId
     */
    this.treoMockApiService
      .onPut( "/api/brands/:brandId" )
      .reply(request => {
        if ( !this.authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const accountId = this.store.selectSnapshot( CurrentAccountState.id );
        Object.assign(request.body, { accountId });
        
        const brandId = request.params.get( 'brandId' );
        return this.http.put( `/mock-api/brands/${ brandId }`, request.body )
          .pipe(map(brand => [ 200, brand ]));
      });

    /**
     * DELETE /brands/:brandId
     */
    this.treoMockApiService
      .onDelete( "/api/brands/:brandId" )
      .reply(request => {
        if ( !this.authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const brandId = request.params.get( 'brandId' );
        return this.http.delete( `/mock-api/brands/${ brandId }` )
          .pipe(map(() => [ 200 ]));
      });
  }
}
