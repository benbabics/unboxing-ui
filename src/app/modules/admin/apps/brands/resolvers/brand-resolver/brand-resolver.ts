import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { withLatestFrom }  from 'rxjs/operators';
import { Brand, BrandState } from 'app/data';

@Injectable({
  providedIn: 'root'
})
export class BrandResolver implements Resolve<any> {

  constructor(
    private _store: Store
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const entities = this._store.select( BrandState.entities );
    return this._store.dispatch( new Brand.Index() )
      .pipe( withLatestFrom(entities) );
  }
}
