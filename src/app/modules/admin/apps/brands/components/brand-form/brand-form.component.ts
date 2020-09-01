import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
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

  brandForm: FormGroup;

  @Input() editMode: boolean = true;

  @Input() 
  set brand(brand: Brand) {
    this._brand = brand;
    this.buildForm( brand );
  }
  get brand(): Brand {
    return this._brand;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _brandIndexComponent: BrandIndexComponent,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this._destroy$ = new Subject();
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
      network: [ group?.network || 'facebook' ],
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

    if ( brand?.emails.length ) {
      brand.emails.forEach(group => this.addEmailField( group ));
    }
    else {
      this.addEmailField();
    }

    if ( brand?.networks.length ) {
      brand.networks.forEach(group => this.addNetworkField( group ));
    }
    else {
      this.addNetworkField();
    }
  }
}
