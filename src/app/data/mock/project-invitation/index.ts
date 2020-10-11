import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './../../../core/auth/auth.service';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';
import { ProjectInvitation } from '../../../../../projects/lib-common/src/public-api';
import { omit } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ProjectInvitationMockApi implements TreoMockApi {
  
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
      .onGet( "/api/projects/:projectId/invitations" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const projectId = request.params.get( 'projectId' );
        return this._http.get<ProjectInvitation[]>( `/mock-api/projects/${ projectId }/invitations` )
          .pipe(
            map(invites => invites.filter(({ recipientId }) => !recipientId)),
            map(invites => invites.map(invite => omit( invite, [ 'token' ] ))),
            map(payload => [ 200, payload ]),
          );
      });
  }
}
