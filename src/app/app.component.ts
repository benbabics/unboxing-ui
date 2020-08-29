import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { flatMap, tap } from 'rxjs/operators';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { Auth, CurrentAccount, CurrentUser } from '../../projects/lib-common/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(
    store: Store,
    router: Router,
    actions$: Actions,
  ) {
    actions$.pipe(
      ofActionSuccessful( Auth.Login ),
      flatMap(() => store.dispatch( new CurrentUser.Refresh()) ),
      tap(() => router.navigateByUrl( '/signed-in-redirect' )),
    )
    .subscribe();
    
    actions$.pipe(
      ofActionSuccessful( Auth.Logout ),
      tap(() => store.dispatch([
        new CurrentUser.Clear(),
        new CurrentAccount.Clear(),
      ])),
    )
    .subscribe();
  }
}
