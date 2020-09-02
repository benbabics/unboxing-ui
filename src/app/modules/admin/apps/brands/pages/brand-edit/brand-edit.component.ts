import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngxs/store';
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

  brand$: Observable<Brand>;

  @ViewChild('brandForm', { static: true }) brandForm: BrandFormComponent;
  
  constructor(
    private _store: Store,
    private _activatedRoute: ActivatedRoute,
    private _brandIndexComponent: BrandIndexComponent,
  ) { }

  ngOnInit() {
    this.brand$ = this._activatedRoute.params
      .pipe(
        withLatestFrom( this._store.select(BrandState.entitiesMap) ),
        map(([ params, brands ]) => brands[ params.id ]),
      );
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
