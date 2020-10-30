import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { tap, takeUntil, map } from 'rxjs/operators';
import { find, fromPairs } from 'lodash';
import { Store } from '@ngxs/store';
import { UpdateFormDirty, UpdateFormValue } from '@ngxs/form-plugin';
import { Brand, BrandState, BrandEmail, BrandNetwork, CurrentMembershipState } from '@libCommon';
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

  private readonly _fieldCollections = [
    { id: "emails",   key: "email" },
    { id: "networks", key: "url" },
  ];
  
  readonly optionsNetworks = [
    { label: "Facebook",  value: "facebook", },
    { label: "Instagram", value: "instagram", },
    { label: "Twitter",   value: "twitter", },
    { label: "Vimeo",     value: "vimeo", },
    { label: "Youtube",   value: "youtube", },
  ];

  manageBrandForm: FormGroup;
  brand$: Observable<Brand>;

  @Input() editMode: boolean = true;
  
  @Output() onSave    = new EventEmitter<Brand>();
  @Output() onDestroy = new EventEmitter<string>();

  get hasUnsavedChanges(): boolean {
    return this.manageBrandForm.dirty;
  }

  get fieldLogoUrl(): string {
    return this.manageBrandForm.get( 'logoUrl' ).value;
  }

  constructor(
    private _store: Store,
    private _formBuilder: FormBuilder,
    private _brandIndexComponent: BrandIndexComponent,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this._destroy$ = new Subject();

    const populateGroup = (fn, arr = []) =>
      arr.length ? arr.forEach(group => fn.call( this, group )) : fn.call( this );
    
    this.brand$ = _store.select( BrandState.active )
      .pipe(
        takeUntil( this._destroy$ ),
        map(brand => brand || {}),
        tap(brand => this._buildForm( brand )),
        tap(brand => _store.dispatch([
          new UpdateFormValue({ path: "brand.manageBrandForm", value: brand }),
          new UpdateFormDirty({ path: "brand.manageBrandForm", dirty: false }),
        ])),
        tap(brand => populateGroup( this.addEmailField, brand?.emails )),
        tap(brand => populateGroup( this.addNetworkField, brand?.networks )),
      );
  }

  ngOnInit() {
    this._brandIndexComponent.openDrawer();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  uploadAvatar(fileList: FileList): void {
    const logoUrl = prompt( `Enter a path for the logo` );
    if ( logoUrl ) {
      this.manageBrandForm.patchValue({ logoUrl });
    }
  }

  removeAvatar(): void {
    this.manageBrandForm.patchValue({ logoUrl: "" });
  }

  updateBrand(): void {
    let brand = this.manageBrandForm.getRawValue();

    const filterCollection = (arr, key) =>
      arr.filter(item => !!item[ key ].trim());

    brand = Object.entries( brand )
      .map(([ key, value ]: any[]) => {
        const field = find(this._fieldCollections, { id: key });
        return [ key, field ? filterCollection( value, field.key ) : value ];
      });

    this.onSave.emit( <Brand>fromPairs(brand) );
  }

  deleteBrand(): void {
    let id = this.manageBrandForm.value.id;
    this.onDestroy.emit( id );
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

  private _buildForm(brand?: Brand): void {
    const accountId = this._store.selectSnapshot( CurrentMembershipState.accountId );
    
    this.manageBrandForm = this._formBuilder.group({
      // static
      id:        [ brand?.id ],
      accountId: [ accountId ],
      
      // editable
      name:     [ brand?.name,   [ Validators.required ] ],
      website:  [ brand?.website ],
      logoUrl:  [ brand?.logoUrl ],
      emails:   this._formBuilder.array([ ]),
      networks: this._formBuilder.array([ ]),
    });
  }
}
