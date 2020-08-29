import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { Reset, CreateOrReplace } from '@ngxs-labs/entity-state';
import { AccountState, BrandState, ProjectState, Account } from '../../states';

@Injectable({
  providedIn: 'root'
})
export class AccountResolverService {

  get activeAccount(): Observable<Account> {
    return this.store.selectOnce(AccountState.active);
  }
  
  constructor(private store: Store) { }

  resolve(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<any> {
    const accountId = route.params.accountId;
    return this.store.dispatch(new Account.Show(accountId))
      .pipe(
        flatMap(()      => this.activeAccount),
        flatMap(account => this.buildAssociations(account)),
      )
  }

  private buildAssociations(account: Account): Observable<any> {
    return this.store.dispatch([
      new Reset(BrandState),
      new Reset(ProjectState),
      // new CreateOrReplace(BrandState,   account.brands),
      // new CreateOrReplace(ProjectState, account.projects),
    ]);
  }
}
