import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { Brand, BrandState } from '../../../../../../../../projects/lib-common/src/public-api';

@Component({
  selector: 'brand-selector',
  templateUrl: './brand-selector.component.html',
  styleUrls: ['./brand-selector.component.scss'],
})
export class BrandSelectorComponent {

  private _destroy$ = new Subject();

  form = new FormGroup({
    brand: new FormControl( '' ),
  });
  
  @Input()
  get active(): Brand {
    return this.form.get( 'brand' ).value;
  }
  set active(brand: Brand) {
    this.form.get( 'brand' ).setValue( brand );
  }

  @Input() label: string;
  @Input() required: boolean = false;
  
  @Output() activeChange = new EventEmitter();
  @ContentChild( TemplateRef ) templateRef: TemplateRef<any>;
  @Select( BrandState.sortedEntities ) brands$: Observable<Brand[]>;

  constructor() {
    // notify bindings when form value is updated
    this.form.get( 'brand' ).valueChanges.pipe(
      takeUntil( this._destroy$ ),
      tap(brandId => this.handleUpdateBrand( brandId )),
    )
    .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private handleUpdateBrand(brandId: string): void {
    this.activeChange.emit( brandId );
  }
}
