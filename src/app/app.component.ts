import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { flatMap, tap, map } from 'rxjs/operators';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { AppState, Auth, CurrentAccount, CurrentAccountState, CurrentUser } from '../../projects/lib-common/src/public-api';

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
    @Inject( DOCUMENT ) private document: any,
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

    store.select( AppState.isLoading ).pipe(
      map(isLoading => ({ isLoading })),
      map(detail    => new CustomEvent( 'appLoading', { detail } )),
      tap(event     => this.document.dispatchEvent( event )),
    )
    .subscribe();

    store.select( CurrentAccountState.logo ).pipe(
      map(logo   => ({ logo })),
      map(detail => new CustomEvent( 'accountChanged', { detail } )),
      tap(event  => this.document.dispatchEvent( event )),
    )
    .subscribe();
  }
}
