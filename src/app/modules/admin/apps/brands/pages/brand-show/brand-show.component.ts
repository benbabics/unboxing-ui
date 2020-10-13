import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { SetActive } from '@ngxs-labs/entity-state';
import { BrandState } from 'app/data';
import { BrandIndexComponent } from './../brand-index/brand-index.component';
import { ComponentCanDeactivateAndCloseDrawer } from '../../brands.guard';

@Component({
  selector: 'brand-show',
  templateUrl: './brand-show.component.html',
  styleUrls: ['./brand-show.component.scss']
})
export class BrandShowComponent implements OnInit, OnDestroy, ComponentCanDeactivateAndCloseDrawer {

  private _destroy$ = new Subject();

  constructor(
    private _store: Store,
    private _activatedRoute: ActivatedRoute,
    private _brandIndexComponent: BrandIndexComponent,
  ) { }

  ngOnInit() {
    this._activatedRoute.params
      .pipe(
        takeUntil( this._destroy$ ),
        tap(params => this._store.dispatch( new SetActive(BrandState, params.id) )),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  closeDrawer() {
    this._brandIndexComponent.closeDrawer();
  }

  canDeactivate(): Observable<boolean> {
    return of( true );
  }
}
