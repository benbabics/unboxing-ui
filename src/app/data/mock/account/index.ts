import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { chain, isString, omit } from 'lodash';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';
import { AuthService } from './../../../core/auth/auth.service';
import { CurrentUserState, Project, User } from '@libCommon';

@Injectable({
  providedIn: 'root'
})
export class AccountMockApi implements TreoMockApi {

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
     * GET /accounts
     */
    this._treoMockApiService
      .onGet( "/api/accounts", 1500 )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const userId = this._store.selectSnapshot( CurrentUserState.userId );
        return this._http.get( `/mock-api/640/accounts?userId=${ userId }` )
          .pipe(map(accounts => [ 200, accounts ]));
      });

    /**
     * GET /accounts/:accountId
     */
    this._treoMockApiService
      .onGet( "/api/accounts/:accountId" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const accountId = request.params.get( 'accountId' );
        return this._http.get( `/mock-api/accounts/${ accountId }`, { params: request.params } )
          .pipe(map(account => [ 200, account ]));
      });

    /**
     * POST /accounts/:accountId/brands
     */
    this._treoMockApiService
      .onPost( "/api/accounts/:accountId/brands" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const accountId = request.params.get( 'accountId' );
        return this._http.post( `/mock-api/accounts/${ accountId }/brands`, request.body)
          .pipe(map(brand => [ 200, brand ]));
      });

    /**
     * POST /accounts/:accountId/projects
     */
    this._treoMockApiService
      .onPost( "/api/accounts/:accountId/projects" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const accountId = request.params.get( 'accountId' );
        request.body.themeId = "theme-default";

        const { invitation, member, ...params } = request.body;
        console.log('* mock invitation & member', invitation, member); // TODO: create Invitation & Member when creating Project
        
        return this._http.post( `/mock-api/accounts/${ accountId }/projects`, params )
          .pipe(
            map(brand => [ 200, brand ]),
          );
      });

    /**
     * GET /accounts/:accountId/projects
     */
    this._treoMockApiService
      .onGet( "/api/accounts/:accountId/projects", 1500 )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        let params = request.params || new HttpParams();
        params = params.append('_expand', 'brand');
        params = params.append('_embed',  'assetElements');

        const accountId = request.params.get( 'accountId' );
        const url = `/mock-api/accounts/${ accountId }/projects`;

        return this._http.get<Project[]>(url, { params } )
          .pipe(
            map(projects => projects.map(project => this.deserializeProject( project ))),
            map(payload  => [ 200, payload ]),
          );
      });

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
            map(members => members.map(member => omit(member, [ 'user.password' ]))),
            map(members => members.filter(({ role, user }: any) => 
              chain({ role, ...user })
                .values()
                .filter(val => isString( val ) && isString( query ))
                .map(val => val.toLowerCase())
                .some(item => item.includes( query.toLowerCase() ))
                .value()
            )),
            map(members => [ 200, members ]),
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
