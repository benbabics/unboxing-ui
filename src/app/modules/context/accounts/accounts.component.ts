import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Account, AccountState, CurrentAccount } from '../../../../../projects/lib-common/src/public-api';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {

  @Select( AccountState.entities ) accounts$: Observable<Account[]>;

  constructor(
    private _store: Store,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) { }

  handleSelectAccount(account: Account): void {
    this._store.dispatch( new CurrentAccount.Select(account) )
      .toPromise()
      .then(() => this._activatedRoute.snapshot.queryParamMap.get( 'redirectURL' ))
      .then(redirectURL => this._router.navigateByUrl( redirectURL || '/example' ));
  }
}
