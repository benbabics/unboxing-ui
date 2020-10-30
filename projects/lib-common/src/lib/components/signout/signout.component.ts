import { Component, OnInit } from '@angular/core';
import { first, tap } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { Store } from '@ngxs/store';
import { Auth } from '@libCommon';

@Component({
  selector: 'lib-signout',
  template: ''
})
export class SignoutComponent implements OnInit {

  constructor(
    private _store: Store,
    private _spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    setTimeout(() => this.handleLogout());
  }

  private handleLogout() {
    this._spinner.show();

    this._store.dispatch( new Auth.Logout() )
      .pipe(
        first(),
        tap(() => this._spinner.hide()),
      )
      .subscribe();
  }
}
