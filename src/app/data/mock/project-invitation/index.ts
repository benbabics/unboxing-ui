import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './../../../core/auth/auth.service';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';
import { CurrentUserState, MembershipRole, ProjectInvitation } from '../../../../../projects/lib-common/src/public-api';
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

    /**
     * POST /projects/:projectId/invitations
     */
    this._treoMockApiService
      .onPost( "/api/projects/:projectId/invitations" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const payload = {
          role:      MembershipRole.User,
          token:     this._generateUuidv4(),
          email:     request.body.email,
          projectId: request.params.get( 'projectId' ),
          senderId:  this._store.selectSnapshot( CurrentUserState.userId ),
        };

        return this._http.post<ProjectInvitation>( `/mock-api/projects/${ payload.projectId }/invitations`, payload )
          .pipe(map(invitation => [ 200, invitation ]));
      });

    /**
     * DELETE /invitations/:invitationId
     */
    this._treoMockApiService
      .onDelete( "/api/invitations/:invitationId" )
      .reply(request => {
        if ( !this._authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const invitationId = request.params.get( 'invitationId' );
        return this._http.delete( `/mock-api/invitations/${ invitationId }` )
          .pipe(
            map(payload => [ 200 ]),
          );
      });
  }

  private _generateUuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
