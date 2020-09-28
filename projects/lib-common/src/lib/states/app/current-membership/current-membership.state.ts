import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Account } from '../../account';
import { CurrentMembership } from './current-membership.action';

export interface CurrentMembershipStateModel extends CurrentMembership {
}

@State<CurrentMembershipStateModel>({
  name: 'currentMembership',
  defaults: {
    id:   null,
    role: null,
    account: {
      id:    null,
      logo:  null,
      title: null,
    }
  }
})
@Injectable()
export class CurrentMembershipState {

  @Selector()
  static exists({ id }: CurrentMembershipStateModel): boolean {
    return !!id;
  }

  @Selector()
  static id({ id }: CurrentMembershipStateModel): string {
    return id;
  }
  
  @Selector()
  static details(state: CurrentMembershipStateModel): CurrentMembership {
    return state;
  }

  @Selector()
  static account({ account }: CurrentMembershipStateModel): Account {
    return account;
  }

  @Selector()
  static accountId({ account }: CurrentMembershipStateModel): string {
    return account.id;
  }
  
  constructor(
    private _http: HttpClient,
  ) { }

  @Action( CurrentMembership.Refresh )
  refresh(ctx: StateContext<CurrentMembershipStateModel>) {
    const id = ctx.getState().id;
    if ( !id ) return Promise.resolve();

    return this._http.get<CurrentMembership>( `/api/memberships/${ id }` )
      .pipe( tap(data => ctx.patchState( data )) );
  }

  @Action( CurrentMembership.Select )
  select(ctx: StateContext<CurrentMembershipStateModel>, { payload }: CurrentMembership.Select) {
    ctx.patchState( payload );
    return ctx.dispatch( new CurrentMembership.Refresh() );
  }

  @Action( CurrentMembership.Clear )
  clear(ctx: StateContext<CurrentMembershipStateModel>) {
    return ctx.patchState({
      id:   null,
      role: null,
      account: {
        id:    null,
        logo:  null,
        title: null,
      }
    });
  }
}
