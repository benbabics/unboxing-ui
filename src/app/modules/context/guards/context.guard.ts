import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Store, Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { finalize, map, withLatestFrom } from "rxjs/operators";
import { App, Account, AccountState, CurrentAccount, CurrentAccountState } from './../../../../../projects/lib-common/src/public-api';

@Injectable()
export class ContextGuard implements CanActivate {

  @Select(AccountState.entities) accounts$: Observable<Account[]>;
  @Select(CurrentAccountState.exists) hasCurrentAccount$: Observable<boolean>;

  constructor(
    private store: Store,
    private router: Router,
  ) { }
  
  canActivate(next, state): Observable<boolean| UrlTree> {
    this.toggleLoading( true );
    
    return this.store.dispatch( new Account.Index() )
      .pipe(
        finalize(() => this.toggleLoading( false )),
        withLatestFrom( this.accounts$, this.hasCurrentAccount$ ),
        map(([_, accounts, hasCurrentAccount]: any) => {
          if ( !hasCurrentAccount && accounts.length === 1 ) {
            this.store.dispatch( new CurrentAccount.Select(accounts[0]) );
            return this.router.createUrlTree([ '/example' ]);
          }

          return true;
        }),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this.store.dispatch( new App.SetLoading(isLoading) );
  }
}
