import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from "@ngxs/store";
import { App } from './app.action';
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
  ) { }

  @Action(App.Start)
  start(ctx: StateContext<AppStateModel>) {
    new Promise(resolve => this.store.dispatch( new CurrentUser.Fetch() )
      .subscribe(() => resolve())
    );
  }
}
