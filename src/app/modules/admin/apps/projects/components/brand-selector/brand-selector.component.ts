import { Component, Input, OnInit, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { delay, filter, take, takeUntil, tap } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { Brand, BrandState } from '../../../../../../../../projects/lib-common/src/public-api';

@Component({
  selector: 'brand-selector',
  templateUrl: './brand-selector.component.html',
  styleUrls: ['./brand-selector.component.scss'],
})
export class BrandSelectorComponent implements OnInit {

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

  @Output() activeChanged = new EventEmitter();
  @ContentChild( TemplateRef ) templateRef: TemplateRef<any>;
  @Select( BrandState.sortedEntities ) brands$: Observable<Brand[]>;

  constructor() {
    // when form value is updated, notify bindings
    this.form.get( 'brand' ).valueChanges.pipe(
      takeUntil( this._destroy$ ),
      tap(brand => this.handleUpdateBrand( brand )),
    )
    .subscribe();
  }

  ngOnInit(): void {
    // get default active, update form value
    this.brands$.pipe(
      take( 1 ),
      filter(() => !this.active ),
      delay( 0 ), // breaks "Expression has changed after it was checked"
      tap(brands => this.active = brands[0]),
    )
    .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private handleUpdateBrand(brand: Brand): void {
    this.activeChanged.emit( brand );
  }
}
