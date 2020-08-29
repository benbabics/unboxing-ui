import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Account, AccountState, CurrentAccount } from '../../../../../projects/lib-common/src/public-api';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {

  @Select(AccountState.entities) accounts$: Observable<Account[]>;

  constructor(
    private store: Store,
    private router: Router,
  ) { }

  handleSelectAccount(account: Account): void {
    this.store.dispatch( new CurrentAccount.Select(account) )
      .toPromise()
      .then(() => this.router.navigateByUrl( '/example' ));
  }
}
