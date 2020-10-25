import { Component, OnInit } from '@angular/core';
import { first, tap } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { Store } from '@ngxs/store';
import { Auth } from 'projects/lib-common/src/lib/states/auth';

@Component({
  selector: 'lib-signout',
  template: ''
})
export class SignoutComponent implements OnInit {

  constructor(
    private store: Store,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    setTimeout(() => this.handleLogout());
  }

  private handleLogout() {
    this.spinner.show();

    this.store.dispatch(new Auth.Logout())
      .pipe(
        first(),
        tap(() => this.spinner.hide()),
      )
      .subscribe();
  }
}
