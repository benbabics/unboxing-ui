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
export class ThemeMockApi implements TreoMockApi {
  
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
     * GET /themes
     */
    this._treoMockApiService
      .onGet( "/api/themes" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        return this._http.get<any[]>( `/mock-api/themes` )
          .pipe(
            map(themes => [ 200, themes ]),
          );
      });
  }
}
