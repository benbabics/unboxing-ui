import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { Store, Actions } from '@ngxs/store';
import { ClearActive, EntityActionType, ofEntityActionSuccessful } from '@ngxs-labs/entity-state';
import { Brand, BrandState } from '../../../../../../../../projects/lib-common/src/public-api';
import { BrandIndexComponent } from './../brand-index/brand-index.component';
import { ComponentCanDeactivateAndCloseDrawer } from '../../brands.guard';
import { BrandFormComponent } from './../../components';

@Component({
  selector: 'brand-new',
  templateUrl: './brand-new.component.html',
  styleUrls: ['./brand-new.component.scss']
})
export class BrandNewComponent implements OnInit, OnDestroy, ComponentCanDeactivateAndCloseDrawer {

  private _destroy$ = new Subject();

  brand: Brand;

  @ViewChild('brandForm', { static: true }) brandForm: BrandFormComponent;
  
  constructor(
    actions$: Actions,
    router: Router,
    snackBar: MatSnackBar,
    private _store: Store,
    private _brandIndexComponent: BrandIndexComponent,
  ) {
    actions$.pipe(
      ofEntityActionSuccessful( BrandState, EntityActionType.Add ),
      takeUntil( this._destroy$ ),
      tap(({ payload }) => snackBar.open(`${ payload.name } was created successfully.`, `Ok`)),
      tap(({ payload }) => router.navigate([ '/brands', payload.id ])),
    )
    .subscribe();
  }

  ngOnInit() {
    this._store.dispatch( new ClearActive(BrandState) );
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  closeDrawer(): void {
    this._brandIndexComponent.closeDrawer();
  }

  canDeactivate(): Observable<boolean> {
    if ( this.brandForm.hasUnsavedChanges ) {
      return this._brandIndexComponent.openDialogSaveChanges();
    }

    return of( true );
  }

  handleBrandSave(brand: Brand): void {
    this._store.dispatch( new Brand.Create(brand) );
  }
}
