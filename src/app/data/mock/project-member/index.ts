import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { omit, uniqBy } from 'lodash';
import { Store } from '@ngxs/store';
import { flatMap, map, tap } from 'rxjs/operators';
import { AuthService } from './../../../core/auth/auth.service';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectMemberMockApi implements TreoMockApi {
  
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
     * GET /projects/:projectId/members
     */
    this._treoMockApiService
      .onGet( "/api/projects/:projectId/members" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        let params = new HttpParams();
        params = params.append( '_expand', 'user' );

        const appendMembershipIds = projects => projects.forEach(({ membershipId }) => 
          params = params.append('id', membershipId ));

        const baseUrl = `/mock-api/projects/${ request.params.get('projectId') }`;

        return this._http.get<any[]>( `${ baseUrl }/projectIds` )
          .pipe(
            flatMap(projects => {
              if ( projects.length ) {
                appendMembershipIds( projects );
                return this._http.get<any[]>( `${ baseUrl }/memberships`, { params } )
              }
              return [];
            }),
            map(members => members.map(member => omit( member, [ 'user.password' ] ))),
            map(members => uniqBy( members, 'userId' )),
            map(payload => [ 200, payload ]),
          );
      });
  }
}
