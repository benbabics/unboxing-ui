import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { Brand } from '../../../../../../../../projects/lib-common/src/public-api';
import { BrandIndexComponent } from './../brand-index/brand-index.component';
import { ComponentCanDeactivateAndCloseDrawer } from '../../brands.guard';
import { BrandFormComponent } from './../../components';

@Component({
  selector: 'brand-new',
  templateUrl: './brand-new.component.html',
  styleUrls: ['./brand-new.component.scss']
})
export class BrandNewComponent implements OnInit, ComponentCanDeactivateAndCloseDrawer {

  brand: Brand;

  @ViewChild('brandForm', { static: true }) brandForm: BrandFormComponent;
  
  constructor(
    private _store: Store,
    private _brandIndexComponent: BrandIndexComponent,
  ) { }

  ngOnInit() {
    this.brand = <Brand>{ };
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
}
