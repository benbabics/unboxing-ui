import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BrandIndexComponent } from './pages';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateBrandsGuard implements CanDeactivate<BrandIndexComponent> {
  
  canDeactivate(
    component: BrandIndexComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | UrlTree {
    
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while ( nextRoute.firstChild ) nextRoute = nextRoute.firstChild;

    // navigating away from brands
    if ( !nextState.url.includes('/brands') ) {
      return true;
    }
    // navigating to detail
    else if ( nextRoute.paramMap.get('id') ) {
      return true;
    }
    else {
      component.closeDrawer();
      return true;
    }
  }
}
