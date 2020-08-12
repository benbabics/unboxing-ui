import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store, Actions, ofAction, ofActionSuccessful, ofActionErrored } from "@ngxs/store";
import { zip, Observable } from 'rxjs';
import { tap, flatMap } from 'rxjs/operators';
import { App } from './app.action';
import { Auth } from '../auth/auth.action';
import { CurrentUser } from '../current-user/current-user.action';

export interface AppStateModel {}

@State<AppStateModel>({
  name: 'app',
  defaults: {}
})
@Injectable()
export class AppState {

  constructor(
    private store: Store,
    router: Router,
    actions$: Actions,
  ) {
    const success$ = (action) => actions$.pipe(ofActionSuccessful(action));
    const failure$ = (action) => actions$.pipe(ofActionErrored(action));

    zip(
      success$(Auth.Login).pipe(
        flatMap(() => store.dispatch(new CurrentUser.Fetch())),
        tap(() => router.navigateByUrl('')),
      ),

      success$(Auth.Logout).pipe(
        tap(() => store.dispatch(new CurrentUser.Clear())),
        tap(() => router.navigateByUrl('')),
      )
    )
    .subscribe();
  }

  @Action(App.Start)
  start(ctx: StateContext<AppStateModel>) {
    new Promise(
      resolve => this.store.dispatch(new CurrentUser.Fetch())
        .subscribe(() => resolve())
    );
  }
}
