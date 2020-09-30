import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { catchError, map, withLatestFrom }  from 'rxjs/operators';
import { Project, ProjectState } from './../../../../../../../../projects/lib-common/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class ProjectResolver implements Resolve<any> {

  constructor(
    private _store: Store,
    private _router: Router,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._store.dispatch( new Project.Show(route.params.id) )
      .pipe(
        withLatestFrom( this._store.select(ProjectState.entitiesMap) ),
        map(([ _, entities ]) => entities[ route.params.id ]),
        catchError(() => {
          const queryParams = { redirectLabel: "Projects", redirectUrl: "/projects" };
          this._router.navigate([ "/errors/404" ], { queryParams });
          return of( false );
        }),
      );
  }
}
