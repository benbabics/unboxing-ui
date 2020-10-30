import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { pick } from 'lodash';
import { map } from 'rxjs/operators';
import { AuthService } from './../../../core/auth/auth.service';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';
import { CurrentMembership, CurrentUserState } from '@libCommon';

@Injectable({
  providedIn: 'root'
})
export class MembershipMockApi implements TreoMockApi {
  
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
     * GET /memberships
     */
    this.treoMockApiService
      .onGet( "/api/memberships" )
      .reply(request => {
        if ( !this.authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const userIdId = this.store.selectSnapshot( CurrentUserState.userId );
        return this.http.get<CurrentMembership[]>( `/mock-api/users/${ userIdId }/memberships` )
          .pipe(
            map(memberships => memberships.map(membership => this._deserialize( membership))),
            map(memberships => [ 200, memberships ]),
          );
      });

    /**
     * GET /memberships/:membershipId
     */
    this.treoMockApiService
      .onGet( "/api/memberships/:membershipId" )
      .reply(request => {
        if ( !this.authService.isAuthenticated ) {
          return [ 403, { error: "Unauthorized" } ];
        }

        const membershipId = request.params.get( 'membershipId' );
        return this.http.get<CurrentMembership>( `/mock-api/memberships/${ membershipId }` )
          .pipe(
            map(membership => this._deserialize( membership )),
            map(membership => [ 200, membership ]),
          );
      });
  }

  private _deserialize(membership: CurrentMembership): CurrentMembership {
    return pick(membership, [ 'id', 'role', 'account' ]);
  }
}
