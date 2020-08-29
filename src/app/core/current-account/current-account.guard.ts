import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { CurrentAccountState } from './../../../../projects/lib-common/src/public-api';

@Injectable()
export class CurrentAccountGuard implements CanActivate {

  constructor(
    private store: Store,
    private router: Router,
  ) { }
  
  canActivate(next, state): boolean | UrlTree {
    return this.checkCurrentAccount();
  }

  canActivateChild(childRoute, state): boolean | UrlTree {
    return this.checkCurrentAccount();
  }

  private checkCurrentAccount(): boolean | UrlTree {
    const exists = this.store.selectSnapshot( CurrentAccountState.exists );
    return exists ? true : this.router.createUrlTree([ "/context" ]);
  }
}
