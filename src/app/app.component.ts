import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { flatMap, tap, map } from 'rxjs/operators';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { TreoConfigService } from '@treo/services/config/config.service';
import { AppState, Auth, CurrentMembershipState, CurrentMembership, CurrentUser, Ui, UiPreferencesState } from 'app/data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(
    store: Store,
    router: Router,
    activatedRoute: ActivatedRoute,
    actions$: Actions,
    treoConfigService: TreoConfigService,
    @Inject( DOCUMENT ) private document: any,
  ) {
    actions$.pipe(
      ofActionSuccessful( Auth.Login ),
      flatMap(() => store.dispatch( new CurrentUser.Refresh()) ),
      map(() => activatedRoute.snapshot.queryParamMap.get( 'redirectURL' )),
      tap(redirectURL => router.navigateByUrl( redirectURL || '/signed-in-redirect' )),
    )
    .subscribe();
    
    actions$.pipe(
      ofActionSuccessful( Auth.Logout ),
      tap(() => store.dispatch([
        new Ui.ClearNavigationItems(),
        new CurrentUser.Clear(),
        new CurrentMembership.Clear(),
      ])),
    )
    .subscribe();

    store.select( AppState.isLoading ).pipe(
      map(isLoading => ({ isLoading })),
      map(detail    => new CustomEvent( 'appLoading', { detail } )),
      tap(event     => this.document.dispatchEvent( event )),
    )
    .subscribe();

    store.select( CurrentMembershipState.account ).pipe(
      map(({ logo }) => ({ logo })),
      map(detail => new CustomEvent( 'accountChanged', { detail } )),
      tap(event  => this.document.dispatchEvent( event )),
    )
    .subscribe();

    store.select( UiPreferencesState.themeAppearance ).pipe(
      tap(theme => treoConfigService.config = { theme }),
    )
    .subscribe();
  }
}
