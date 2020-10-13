import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CreateOrReplace, defaultEntityState, EntityState, EntityStateModel, IdStrategy, SetActive, SetLoading } from "@ngxs-labs/entity-state";
import { Action, State, StateContext, Store } from "@ngxs/store";
import { Membership } from "./membership.action";
import { tap } from "rxjs/operators";

export interface MembershipStateModel extends EntityStateModel<Membership> {
}

@State({
  name: 'membership',
  defaults: {
    ...defaultEntityState(),
  }
})
@Injectable()
export class MembershipState extends EntityState<Membership> {

  constructor(
    private _store: Store,
    private _http: HttpClient,
  ) {
    super( MembershipState, 'id', IdStrategy.EntityIdGenerator );
  }

  @Action( Membership.Index )
  crudIndex(ctx: StateContext<MembershipStateModel>) {
    this._toggleLoading( true );

    return this._http.get<Membership[]>( `/api/memberships` )
      .pipe(
        tap(memberships => ctx.dispatch( new CreateOrReplace(MembershipState, memberships) )),
        tap(() => this._toggleLoading( false )),
      );
  }

  @Action( Membership.Show )
  crudShow(ctx: StateContext<MembershipStateModel>, { id }: Membership.Show) {
    this._toggleLoading( true );

    return this._http.get<Membership>( `/api/memberships/${ id }` )
      .pipe(
        tap(membership => ctx.dispatch( new CreateOrReplace(MembershipState, membership) )),
        tap(() => ctx.dispatch( new SetActive(MembershipState, `${ id }`) )),
        tap(() => this._toggleLoading( false )),
      );
  }

  private _toggleLoading(isLoading: boolean): void {
    this._store.dispatch( new SetLoading(MembershipState, isLoading) );
  }
}
