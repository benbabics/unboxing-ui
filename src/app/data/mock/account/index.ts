import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { flatMap, map, mapTo } from 'rxjs/operators';
import { chain, isString, omit } from 'lodash';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';
import { AuthService } from './../../../core/auth/auth.service';
import { CurrentMembershipState, CurrentUserState, Project, User } from '@libCommon';
import { forkJoin, of } from 'rxjs';

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
        
        // Create Association: Membership
        const membershipId = this._store.selectSnapshot( CurrentMembershipState.id );
        const createMembership = id => this._http.post(`/mock-api/projects/${ id }/projectIds`, { membershipId });
        
        // Create Association: Slides
        const createSlides = id => this._http.get( `/mock-api/themes/1` )
          .pipe(
            map((theme: any) => ({
              themeId:   theme.slug,
              templates: theme.templates.map(({ id }) => id),
            })),
            map(({ themeId, templates }: any) => templates.map(templateId => {
              const payload = { themeId, templateId, attributes: {} };
              return this._http.post( `/mock-api/projects/${ id }/slides`, payload );
            })),
            flatMap(slides$ => forkJoin( slides$ )),
          );
        
        // Project Payload
        request.body.themeId = "theme-default";
        const { invitation, member, ...params } = request.body;
        const accountId = request.params.get( 'accountId' );

        // Create Project
        return this._http.post( `/mock-api/accounts/${ accountId }/projects`, params )
          .pipe(
            flatMap((project: any) => createMembership( project.id ).pipe( mapTo( project ) )),
            flatMap((project: any) => createSlides( project.id ).pipe( mapTo( project ) )),
            map(project => [ 200, project ]),
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
