import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Membership, MembershipState } from '../states';
import { CurrentMembership } from '@libCommon';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {

  @Select( MembershipState.entities ) memberships$: Observable<Membership[]>;

  constructor(
    private _store: Store,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) { }

  handleSelectMembership(membership: Membership): void {
    this._store.dispatch( new CurrentMembership.Select(membership) )
      .toPromise()
      .then(() => this._activatedRoute.snapshot.queryParamMap.get( 'redirectURL' ))
      .then(redirectURL => this._router.navigateByUrl( redirectURL || '/example' ));
  }
}
