import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StateContext, Store, State, Action } from '@ngxs/store';
import { defaultEntityState, EntityStateModel, EntityState, IdStrategy, SetActive, CreateOrReplace, SetLoading } from '@ngxs-labs/entity-state';
import { get } from 'lodash';
import { tap } from 'rxjs/operators';

import { Account } from './account.action';

export interface AccountStateModel extends EntityStateModel<Account> {
  manageAccountForm,
}

@State({
  name: 'account',
  defaults: {
    ...defaultEntityState(),
    manageAccountForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    }
  }
})
@Injectable()
export class AccountState extends EntityState<Account> {

  constructor(
    private store: Store,
    private http: HttpClient,
  ) {
    super(AccountState, 'id', IdStrategy.EntityIdGenerator);
  }

  @Action(Account.Index)
  crudIndex(ctx: StateContext<AccountStateModel>) {
    this.toggleLoading(true);
    
    // temporary until request scoped by real API
    const userId = get(this.store.snapshot(), 'currentUser.id');
    return this.http.get<Account[]>(`/api/640/accounts?userId=${userId}`)
      .pipe(
        tap(accounts => this.store.dispatch(new CreateOrReplace(AccountState, accounts))),
        tap(() => this.toggleLoading(false)),
      );
  }

  @Action(Account.Show)
  crudShow(ctx: StateContext<AccountStateModel>, { id }: Account.Show) {
    this.toggleLoading(true);

    return this.http.get<Account>(`/api/accounts/${id}?_embed=brands&_embed=projects`)
      .pipe(
        tap(account => this.store.dispatch(new CreateOrReplace(AccountState, account))),
        tap(() => this.store.dispatch(new SetActive(AccountState, `${id}`))),
        tap(() => this.toggleLoading(false)),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this.store.dispatch(new SetLoading(AccountState, isLoading));
  }
}
