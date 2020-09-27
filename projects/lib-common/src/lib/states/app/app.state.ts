import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { App } from './app.action';
import { AuthState } from './auth';
import { CurrentMembership, CurrentMembershipState } from './current-membership';
import { CurrentUser, CurrentUserState } from './current-user';
import { CurrentAccount, CurrentAccountState } from './current-account';

export interface AppStateModel extends App {}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    isLoading: true,
  },
  children: [
    AuthState,
    CurrentUserState,
    CurrentMembershipState,
    CurrentAccountState,
  ]
})
@Injectable()
export class AppState {

  @Selector()
  static isLoading({ isLoading }: AppStateModel): boolean {
    return isLoading;
  }

  constructor(
    private store: Store,
  ) { }

  @Action( App.Start )
  start(ctx: StateContext<AppStateModel>) {
    return this.store.dispatch([
      new CurrentUser.Refresh(),
      new CurrentMembership.Refresh(),
      new CurrentAccount.Refresh(),
    ]);
  }

  @Action( App.SetLoading )
  setLoading(ctx: StateContext<AppStateModel>, { isLoading }: App.SetLoading) {
    ctx.patchState({ isLoading });
  }

  private toggleLoading(isLoading: boolean): void {
    this.store.dispatch( new App.SetLoading(isLoading) );
  }
}
