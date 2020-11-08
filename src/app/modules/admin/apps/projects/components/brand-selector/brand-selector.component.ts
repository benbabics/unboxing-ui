import { Component, OnDestroy, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { Brand, BrandState } from '@libCommon';

@Component({
  selector: 'brand-selector',
  templateUrl: './brand-selector.component.html',
  styleUrls: ['./brand-selector.component.scss'],
})
export class BrandSelectorComponent implements OnDestroy {

  private _destroy$ = new Subject();

  isLoading: boolean;
  brands$: Observable<Brand[]>;
  
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
  @Input() allowDefaultValue: boolean = true;
  
  @Output() activeChange = new EventEmitter();
  @ContentChild( TemplateRef ) templateRef: TemplateRef<any>;

  constructor(
    private _store: Store,
  ) {
    // notify bindings when form value is updated
    this.form.get( 'brand' ).valueChanges.pipe(
      takeUntil( this._destroy$ ),
      tap(brandId => this.handleUpdateBrand( brandId )),
    )
    .subscribe();

    this._store.select( BrandState.loading )
      .pipe(
        takeUntil( this._destroy$ ),
        tap(isLoading => this.isLoading = isLoading)
      )
      .subscribe();
    
    this.brands$ = this._store.select( BrandState.sortedEntities )
      .pipe(
        filter((brands: Brand[]) => brands.length > 0),
        // TODO: deserialize payload ids to string
        map(brands => brands.map(brand => ({ ...brand, id: `${ brand.id }` }))),
        tap(([{ id }]) => this.allowDefaultValue && this.handleUpdateBrand( `${id}` )),
        map(brands => <any[]>brands)
      );

    const entities = this._store.selectSnapshot( BrandState.entities );
    if ( !entities.length ) this._store.dispatch( new Brand.Index() );
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private handleUpdateBrand(brandId: string): void {
    this.activeChange.emit( brandId );
  }
}
