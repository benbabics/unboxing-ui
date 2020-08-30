import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { BrandsListComponent } from './../list/list.component';
import { MatDrawerToggleResult } from '@angular/material/sidenav';

@Component({
  selector: 'app-brands-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandsDetailsComponent implements OnInit, OnDestroy {

  private destroy$: Subject<any>;
  
  brand;
  editMode: boolean;
  brandForm: FormGroup;
  
  constructor(
    private _formBuilder: FormBuilder,
    private _brandsListComponent: BrandsListComponent,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.destroy$ = new Subject();
    this.editMode = false;
  }

  ngOnInit() {
    this._brandsListComponent.matDrawer.open();

    this.brandForm = this._formBuilder.group({
      address: [ '' ],
    });

    this.brand = {
      address: "15432 Markese Ave, Allen Park, MI 48101"
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._brandsListComponent.matDrawer.close();
  }

  toggleEditMode(editMode: boolean = null): void {
    this.editMode = editMode === null ? !this.editMode : editMode;
    this._changeDetectorRef.markForCheck();
  }

  updateBrand(): void {
    console.log('* updateBrand');
  }

  deleteBrand(): void {
    console.log('* deleteBrand');
  }
}
