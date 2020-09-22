import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { SetActive, ClearActive } from '@ngxs-labs/entity-state';
import { ProjectState } from '../../../../../../../../projects/lib-common/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown> {

  constructor(
    private _store: Store,
    private _router: Router,
  ) { }
  
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const queryParams = {
      redirectLabel: "Projects",
      redirectUrl:   "/projects",
    };
    const redirect = this._router.createUrlTree([ "/errors/404" ], { queryParams });
    
    return this._canActivateProject( next.params.id ).pipe(
      map(canActivate => canActivate || redirect),
    );
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._canActivateProject( next.params.id ).pipe(
      tap(() => this._store.dispatch(
        new SetActive( ProjectState, next.params.id )
      )),
    );
  }

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this._store.dispatch( new ClearActive(ProjectState) );
    return true;
  }
  
  private _canActivateProject(id: string): Observable<boolean> {
    return this._store.selectOnce( ProjectState.entitiesMap )
      .pipe( 
        map(entities => entities[ id ]),
        map(project  => !!project),
      );
  }
}
