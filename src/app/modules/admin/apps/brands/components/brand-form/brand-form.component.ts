import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { tap, takeUntil, map } from 'rxjs/operators';
import { Store, Actions, ofActionDispatched, ofActionCompleted } from '@ngxs/store';
import { Brand, BrandEmail, BrandNetwork } from '../../../../../../../../projects/lib-common/src/public-api';
import { BrandIndexComponent } from './../../pages';

@Component({
  selector: 'brand-form',
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandFormComponent implements OnInit, OnDestroy {

  private _destroy$: Subject<any>;
  private _brand: Brand;
  
  readonly optionsNetworks = [
    { label: "Facebook",  value: "facebook", },
    { label: "Instagram", value: "instagram", },
    { label: "Twitter",   value: "twitter", },
    { label: "Vimeo",     value: "vimeo", },
    { label: "Youtube",   value: "youtube", },
  ];

  manageBrandForm: FormGroup;

  @Input() editMode: boolean = true;

  @Input() 
  set brand(brand: Brand) {
    this._brand = brand;
    this._store.dispatch( new Brand.Manage(brand) );
  }
  get brand(): Brand {
    return this._brand;
  }

  get hasUnsavedChanges(): boolean {
    return this.manageBrandForm.dirty;
  }

  constructor(
    actions$: Actions,
    private _store: Store,
    private _formBuilder: FormBuilder,
    private _brandIndexComponent: BrandIndexComponent,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this._destroy$ = new Subject();

    actions$.pipe(
      ofActionDispatched( Brand.Manage ),
      takeUntil(this._destroy$),
      tap(() => this._buildForm()),
    )
    .subscribe();

    const addField = (fn, arr = []) =>
      arr.length ? arr.forEach(group => fn.call( this, group )) : fn.call( this );
    
    actions$.pipe(
      ofActionCompleted( Brand.Manage ),
      takeUntil( this._destroy$ ),
      map(() => ({ emails: this.brand.emails, networks: this.brand.networks })),
      tap(({ emails })   => addField( this.addEmailField,   emails )),
      tap(({ networks }) => addField( this.addNetworkField, networks )),
    )
    .subscribe();
  }

  ngOnInit() {
    this._brandIndexComponent.openDrawer();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
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

    (this.manageBrandForm.get('emails') as FormArray).push( emailFormGroup );
    this._changeDetectorRef.markForCheck();
  }

  removeEmailField(index: number): void {
    const emailsFormArray = this.manageBrandForm.get('emails') as FormArray;
    emailsFormArray.removeAt( index );
    this._changeDetectorRef.markForCheck();
  }

  addNetworkField(group?: BrandNetwork): void {
    const networkFormGroup = this._formBuilder.group({
      network: [ group?.network || 'facebook' ],
      label:   [ group?.label   || '' ],
      url:     [ group?.url     || '' ],
    });

    (this.manageBrandForm.get('networks') as FormArray).push( networkFormGroup );
    this._changeDetectorRef.markForCheck();
  }

  removeNetworkField(index: number): void {
    const networksFormArray = this.manageBrandForm.get('networks') as FormArray;
    networksFormArray.removeAt( index );
    this._changeDetectorRef.markForCheck();
  }

  private _buildForm(): void {
    this.manageBrandForm = this._formBuilder.group({
      name:     [ '', [ Validators.required ] ],
      website:  [ '', [ Validators.required ] ],
      emails:   this._formBuilder.array([ ]),
      networks: this._formBuilder.array([ ]),
    });
  }
}
