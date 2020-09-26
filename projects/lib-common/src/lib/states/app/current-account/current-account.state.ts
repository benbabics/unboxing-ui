import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { omit } from 'lodash';
import { finalize, map, tap } from 'rxjs/operators';
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
  }
})
@Injectable()
export class CurrentAccountState {

  @Selector()
  static exists({ id }: CurrentAccountStateModel): boolean {
    return !!id;
  }

  @Selector()
  static id({ id }: CurrentAccountStateModel): string {
    return id;
  }
  
  @Selector()
  static details(state: CurrentAccountStateModel): CurrentAccount {
    return state;
  }

  @Selector()
  static logo({ logo }: CurrentAccountStateModel): string {
    return logo;
  }

  constructor(
    private store: Store,
    private http: HttpClient,
  ) { }

  @Action( CurrentAccount.Refresh )
  refresh(ctx: StateContext<CurrentAccountStateModel>) {
    const id = ctx.getState().id;
    if ( !id ) return Promise.resolve();
    
    let params = new HttpParams();
    params = params.append('_embed', 'brands');
    params = params.append('_embed', 'projects');

    return this.http.get<CurrentAccount>( `/api/accounts/${ id }`, { params } )
      .pipe(
        tap((data: any) => {
          const account = omit( data, 'brands', 'projects' );
          ctx.patchState( account );
          this.store.dispatch([
            new CreateOrReplace( AccountState, account ),
            new Reset( BrandState ),
            new CreateOrReplace( BrandState, data.brands ),
            new Reset( ProjectState ),
            new CreateOrReplace( ProjectState, data.projects ),
          ]);
        }),
      );
  }

  @Action( CurrentAccount.Select )
  select(ctx: StateContext<CurrentAccountStateModel>, { payload }: CurrentAccount.Select) {
    ctx.patchState( payload );
    return this.store.dispatch( new CurrentAccount.Refresh() );
  }

  @Action( CurrentAccount.Clear )
  clear(ctx: StateContext<CurrentAccountStateModel>) {
    return ctx.patchState({
      id:     null,
      title:  null,
      logo:   null,
    });
  }
}
