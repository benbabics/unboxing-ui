import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../states';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserGuard implements CanActivate {
  
  get isAuthenticated(): boolean {
    return this.store.selectSnapshot(AuthState.isAuthenticated);
  }

  constructor(
    private store: Store,
    private router: Router,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.isAuthenticated) {
      return this.router.createUrlTree(['']);
    }

    return true;
  }
}
