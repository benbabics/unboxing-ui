import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { AuthService } from './../../../core/auth/auth.service';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';
import { Project } from '../../../../../projects/lib-common/src/lib/states';

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
            map(projects => this.respondUniqueProject( projects )),
            map(payload  => [ 200, payload ]),
          );
      });
  }

  private respondUniqueProject(projects: Project[]): boolean {
    return projects.length === 0;
  }
}
