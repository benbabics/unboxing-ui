import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, Observable } from 'rxjs';
import { withLatestFrom, map, tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { BrandsListComponent } from './../list/list.component';
import { Brand, BrandState, BrandEmail, BrandNetwork } from '../../../../../../../projects/lib-common/src/public-api';

@Component({
  selector: 'app-brands-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandsDetailsComponent implements OnInit, OnDestroy {

  private destroy$: Subject<any>;
  
  brand$: Observable<Brand>;
  editMode: boolean;
  brandForm: FormGroup;

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _brandsListComponent: BrandsListComponent,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.destroy$ = new Subject();
    this.editMode = false;
  }

  ngOnInit() {
    this.brand$ = this.activatedRoute.params
      .pipe(
        withLatestFrom( this.store.select(BrandState.entitiesMap) ),
        map(([ params, brands ]) => brands[ params.id ]),
        tap(brand => this.buildForm( brand )),
      );
    
    this._brandsListComponent.matDrawer.open();
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

  uploadAvatar(fileList: FileList): void {
    console.log('* uploadAvatar', fileList);
  }

  removeAvatar(): void {
    console.log('* removeAvatar');
  }

  updateBrand(): void {
    console.log('* updateBrand');
  }

  deleteBrand(): void {
    console.log('* deleteBrand');
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  addEmailField(group?: BrandEmail): void {
    const emailFormGroup = this._formBuilder.group({
      email: [ group?.email || '' ],
      label: [ group?.label || '' ],
    });

    (this.brandForm.get('emails') as FormArray).push( emailFormGroup );
    this._changeDetectorRef.markForCheck();
  }

  removeEmailField(index: number): void {
    const emailsFormArray = this.brandForm.get('emails') as FormArray;
    emailsFormArray.removeAt( index );
    this._changeDetectorRef.markForCheck();
  }

  addNetworkField(group?: BrandNetwork): void {
    const networkFormGroup = this._formBuilder.group({
      network: [ group?.network || '' ],
      label:   [ group?.label   || '' ],
      url:     [ group?.url     || '' ],
    });

    (this.brandForm.get('networks') as FormArray).push( networkFormGroup );
    this._changeDetectorRef.markForCheck();
  }

  removeNetworkField(index: number): void {
    const networksFormArray = this.brandForm.get('networks') as FormArray;
    networksFormArray.removeAt( index );
    this._changeDetectorRef.markForCheck();
  }

  private buildForm(brand: Brand): void {
    this.brandForm = this._formBuilder.group({
      name:     [ brand?.name, [ Validators.required ] ],
      website:  [ brand?.website, [ Validators.required ] ],
      emails:   this._formBuilder.array([ ]),
      networks: this._formBuilder.array([ ]),
    });

    if ( brand.emails.length ) {
      brand.emails.forEach(group => this.addEmailField( group ));
    }
    else {
      this.addEmailField();
    }

    if ( brand.networks.length ) {
      brand.networks.forEach(group => this.addNetworkField( group ));
    }
    else {
      this.addNetworkField();
    }
  }
}
