import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

export interface ComponentCanDeactivateAndCloseDrawer {
  canDeactivate: () => Observable<boolean>;
  closeDrawer: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateBrandsGuard implements CanDeactivate<ComponentCanDeactivateAndCloseDrawer> {
  
  canDeactivate(
    component: ComponentCanDeactivateAndCloseDrawer,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | UrlTree {

    let nextRoute: ActivatedRouteSnapshot    = nextState.root;
    while ( nextRoute.firstChild ) nextRoute = nextRoute.firstChild;

    return component.canDeactivate().pipe(
      map((canDeactivate: boolean) => {
        // cannot deactivate, stop!
        if ( !canDeactivate ) {
          return false;
        }
        // navigating away from brands
        else if (!nextState.url.includes('/brands')) {
          return true;
        }
        // navigating to detail
        else if (nextRoute.paramMap.get('id')) {
          return true;
        }
        // close drawer and proceed
        else {
          component.closeDrawer();
          return true;
        }
      })
    );
  }
}
