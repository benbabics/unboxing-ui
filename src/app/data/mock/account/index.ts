import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { map, filter } from 'rxjs/operators';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';
import { AuthService } from './../../../core/auth/auth.service';
import { CurrentUserState, Project } from '../../../../../projects/lib-common/src/public-api';

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

    /**
     * GET /accounts/:accountId/projects
     */
    this.treoMockApiService
      .onGet( "/api/accounts/:accountId/projects", 1500 )
      .reply(request => {
        if ( !this.authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        let params = request.params || new HttpParams();
        params = params.append('_expand', 'brand');
        params = params.append('_embed',  'assetElements');

        const accountId = request.params.get( 'accountId' );
        const url = `/mock-api/accounts/${ accountId }/projects`;

        return this.http.get<Project[]>(url, { params } )
          .pipe(
            map(projects => projects.map(project => this.deserializeProject( project ))),
            map(payload  => [ 200, payload ]),
          );
      });
  }

  private deserializeProject({ assetElements, ...project }: any): any {
    const collection = assetElements
      .filter(({ format }) => format === "PHOTO")
      .slice(0, 5);

    return {
      ...project,
      assetElements: {
        collection,
        count: assetElements.length
      }
    };
  }
}
