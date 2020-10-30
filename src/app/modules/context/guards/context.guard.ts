import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store, Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { finalize, map, tap, withLatestFrom } from "rxjs/operators";
import { Membership, MembershipState } from '../states';
import { App, CurrentMembership, CurrentMembershipState } from '@libCommon';

@Injectable()
export class ContextGuard implements CanActivate {

  @Select( MembershipState.entities ) memberships$: Observable<Membership[]>;
  @Select( CurrentMembershipState.exists ) hasCurrentMembership$: Observable<boolean>;

  constructor(
    private store: Store,
    private router: Router,
  ) { }
  
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean| UrlTree> {
    this.toggleLoading( true );
    
    return this.store.dispatch( new Membership.Index() )
      .pipe(
        finalize(() => this.toggleLoading( false )),
        withLatestFrom( this.memberships$, this.hasCurrentMembership$ ),
        map(([ _, memberships, hasCurrentMembership ]: any) => {
          if ( !hasCurrentMembership && memberships.length === 1 ) {
            this.store.dispatch( new CurrentMembership.Select(memberships[ 0 ]) );
            const redirectURL = next.queryParamMap.get( 'redirectURL' );
            return this.router.createUrlTree([ redirectURL || '/example' ]);
          }

          return true;
        }),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this.store.dispatch( new App.SetLoading(isLoading) );
  }
}
