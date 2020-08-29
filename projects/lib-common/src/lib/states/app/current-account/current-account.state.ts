import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { CurrentAccount } from './current-account.action';

export interface CurrentAccountStateModel extends CurrentAccount {
}

@State<CurrentAccountStateModel>({
  name: 'currentAccount',
  defaults: {
    id:     '',
    title:  '',
    logo:   '',
    userId: '',
  }
})
@Injectable()
export class CurrentAccountState {

  @Selector()
  static exists({ id }: CurrentAccountStateModel): boolean {
    return !!id;
  }

  @Selector()
  static details(state: CurrentAccountStateModel): CurrentAccount {
    return state;
  }
  
  @Selector()
  static userId({ userId }: CurrentAccountStateModel): string {
    return userId;
  }

  @Selector()
  static logo({ logo }: CurrentAccountStateModel): string {
    return logo;
  }

  constructor(
    private store: Store,
    private http: HttpClient,
  ) { }

  @Action(CurrentAccount.Refresh)
  refresh(ctx: StateContext<CurrentAccountStateModel>) {
    const id = ctx.getState().id;

    if (!id) return Promise.resolve();

    return new Promise(resolve => {
      this.http.get<CurrentAccount>( `/api/accounts/${id}` )
        .pipe(
          tap(account => this.store.dispatch( new CurrentAccount.Select(account) )),
          finalize(() => resolve()),
        )
        .subscribe();
    });
  }

  @Action(CurrentAccount.Select)
  select(ctx: StateContext<CurrentAccountStateModel>, { payload }: CurrentAccount.Select) {
    return ctx.patchState( payload );
  }

  @Action(CurrentAccount.Clear)
  clear(ctx: StateContext<CurrentAccountStateModel>) {
    return ctx.patchState({
      id:     null,
      title:  null,
      logo:   null,
      userId: null,
    });
  }
}
