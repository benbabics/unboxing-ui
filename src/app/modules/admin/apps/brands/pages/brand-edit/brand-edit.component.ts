import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, Subject } from 'rxjs';
import { map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Store, Actions } from '@ngxs/store';
import { EntityActionType, ofEntityActionSuccessful, SetActive } from '@ngxs-labs/entity-state';
import { Brand, BrandState } from '../../../../../../../../projects/lib-common/src/public-api';
import { BrandIndexComponent } from './../brand-index/brand-index.component';
import { ComponentCanDeactivateAndCloseDrawer } from '../../brands.guard';
import { BrandFormComponent } from './../../components';

@Component({
  selector: 'brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrls: ['./brand-edit.component.scss']
})
export class BrandEditComponent implements OnInit, ComponentCanDeactivateAndCloseDrawer {

  private _destroy$ = new Subject();
  
  @ViewChild('brandForm', { static: true }) brandForm: BrandFormComponent;
  
  constructor(
    actions$: Actions,
    router: Router,
    snackBar: MatSnackBar,
    private _store: Store,
    private _activatedRoute: ActivatedRoute,
    private _brandIndexComponent: BrandIndexComponent,
  ) {
    actions$.pipe(
      ofEntityActionSuccessful( BrandState, EntityActionType.Update ),
      withLatestFrom( this._activatedRoute.params ),
      takeUntil( this._destroy$ ),
      map(([ { payload }, params ]) => ({ params, brand: payload.data })),
      tap(({ brand }) => snackBar.open(`${ brand.name } was updated successfully.`, `Ok`)),
      tap(({ params })  => router.navigate([ '/brands', params.id ])),
    )
    .subscribe();

    actions$.pipe(
      ofEntityActionSuccessful( BrandState, EntityActionType.Remove ),
      withLatestFrom( this._activatedRoute.params ),
      takeUntil( this._destroy$ ),
      tap(() => snackBar.open(`Brand was removed successfully.`, `Ok`)),
      tap(() => router.navigate([ '/brands' ])),
    )
    .subscribe();
  }

  ngOnInit() {
    this._activatedRoute.params.pipe(
      takeUntil( this._destroy$ ),
      tap(params => this._store.dispatch( new SetActive(BrandState, params.id) )),
      withLatestFrom( this._store.select(BrandState.entitiesMap) ),
      map(([ params, brands ]) => brands[ params.id ]),
    )
    .subscribe()
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  handleBrandSave(brand: Brand): void {
    this._store.dispatch( new Brand.Update(brand) );
  }
  handleBrandDestroy(id: string): void {
    this._store.dispatch( new Brand.Destroy(id) );
  }

  closeDrawer() {
    this._brandIndexComponent.closeDrawer();
  }

  canDeactivate(): Observable<boolean> {
    if ( this.brandForm.hasUnsavedChanges ) {
      return this._brandIndexComponent.openDialogSaveChanges();
    }

    return of( true );
  }
}
