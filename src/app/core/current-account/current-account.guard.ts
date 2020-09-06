import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { CurrentAccountState } from './../../../../projects/lib-common/src/public-api';

@Injectable()
export class CurrentAccountGuard implements CanActivate {

  constructor(
    private store: Store,
    private router: Router,
  ) { }
  
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.checkCurrentAccount( state.url );
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.checkCurrentAccount( state.url );
  }

  private checkCurrentAccount(redirectURL: string): boolean | UrlTree {
    const queryParams = { redirectURL };
    const exists = this.store.selectSnapshot( CurrentAccountState.exists );
    return exists ? true : this.router.createUrlTree([ "/context" ], { queryParams });
  }
}
