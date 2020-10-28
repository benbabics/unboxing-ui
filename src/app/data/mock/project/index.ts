import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { AuthService } from './../../../core/auth/auth.service';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';
import { CurrentMembershipState, Project } from 'app/data';

@Injectable({
  providedIn: 'root'
})
export class ProjectMockApi implements TreoMockApi {
  
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
     * GET /projects?slug=
     */
    this._treoMockApiService
      .onGet( "/api/projects" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const slug = request.params.get( 'isSlugUnique' );
        let params = new HttpParams();
        params = params.append( 'slug', slug );

        return this._http.get<Project[]>( `/mock-api/projects`, { params } )
          .pipe(
            map(projects => projects.length === 0),
            map(payload  => [ 200, payload ]),
          );
      });

    /**
     * GET /projects/:projectId
     */
    this._treoMockApiService
      .onGet( "/api/projects/:projectId" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        let params = new HttpParams();
        [ 'brand' ].forEach(key => params = params.append( '_expand', key ));
        [ 'slides', 'assetDirectories', 'assetElements' ].forEach(key => params = params.append( '_embed', key ));

        const projectId = request.params.get( 'projectId' );
        return this._http.get<Project>( `/mock-api/projects/${ projectId }`, { params } )
          .pipe(map(payload  => [ 200, payload ]));
      });

    /**
     * PATCH /projects/:projectId
     */
    this._treoMockApiService
      .onPatch( "/api/projects/:projectId" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const accountId = this._store.selectSnapshot( CurrentMembershipState.accountId );
        Object.assign(request.body, { accountId });
        
        const projectId = request.params.get( 'projectId' );
        request.body.id = projectId;
        return this._http.patch( `/mock-api/projects/${ projectId }`, request.body )
          .pipe(map(project => [ 200, project ]));
      });
  }
}
