import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BrandsDetailsComponent } from './details/details.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateBrandsGuard implements CanDeactivate<BrandsDetailsComponent> {
  canDeactivate(
    component: BrandsDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
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
      return component.closeDrawer().then(() => true);
    }
  }
  
}
