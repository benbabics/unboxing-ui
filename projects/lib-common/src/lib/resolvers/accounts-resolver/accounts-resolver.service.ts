import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Account } from '../../states';

@Injectable({
  providedIn: 'root'
})
export class AccountsResolverService {

  constructor(private store: Store) { }

  resolve(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<any> {
    return this.store.dispatch(new Account.Index());
  }
}
