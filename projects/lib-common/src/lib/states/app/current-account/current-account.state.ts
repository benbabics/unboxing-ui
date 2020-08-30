import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Reset, CreateOrReplace } from '@ngxs-labs/entity-state';
import { CurrentAccount } from './current-account.action';
import { AccountState } from './../../account';
import { BrandState } from './../../brand';
import { ProjectState } from '../../project';

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

    let params = new HttpParams();
    params = params.append('_embed', 'brands');
    params = params.append('_embed', 'projects');

    return new Promise(resolve => {
      this.http.get<CurrentAccount>( `/api/accounts/${id}`, { params } )
        .pipe(
          map(({ brands, projects, ...account }: any) =>
            this.store.dispatch([
              ctx.patchState( account ),
              new CreateOrReplace( AccountState, account ),
              new Reset( BrandState ),
              new CreateOrReplace( BrandState, brands ),
              new Reset( ProjectState ),
              new CreateOrReplace( ProjectState, projects ),
            ])
          ),
          finalize(() => resolve()),
        )
        .subscribe();
    });
  }

  @Action(CurrentAccount.Select)
  select(ctx: StateContext<CurrentAccountStateModel>, { payload }: CurrentAccount.Select) {
    ctx.patchState( payload );
    return this.store.dispatch( new CurrentAccount.Refresh() );
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
