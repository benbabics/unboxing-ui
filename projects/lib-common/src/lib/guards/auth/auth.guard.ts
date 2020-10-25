import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../states';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  
  get isAuthenticated(): boolean {
    return this.store.selectSnapshot(AuthState.isAuthenticated);
  }
  
  constructor(
    private store: Store,
    private router: Router,
    @Inject('Configuration') private config,
  ) { }
  
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const prefix     = this.config.runnerPrefix;
    const casePrefix = prefix ? `/${prefix}` : '';

    switch (state.url) {
      case `${casePrefix}/signup`:
        return true;
      
      case `${casePrefix}/signin`:
        return this.redirect([ prefix ], this.isAuthenticated);

      default:
        return this.redirect([ prefix, 'signin' ], !this.isAuthenticated);
    }
  }

  private redirect(tree: string[], shouldRedirect: boolean): boolean | UrlTree {
    if (shouldRedirect)
      return this.router.createUrlTree(tree);

    return true;
  }
}
