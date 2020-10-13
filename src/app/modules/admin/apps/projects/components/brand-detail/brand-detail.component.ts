import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ContentChild, TemplateRef } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Brand, BrandState } from 'app/data';

@Component({
  selector: 'brand-detail',
  template: `
    <ng-container *ngIf="brand$ | async as brand">
      <ng-template
        [ngTemplateOutlet]="templateRef"
        [ngTemplateOutletContext]="{ $implicit: brand }">
      </ng-template>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandDetailComponent implements OnChanges {

  brand$: Observable<Brand>;
  
  @Input() id: string;
  @ContentChild( TemplateRef ) templateRef: TemplateRef<any>;
  
  constructor(
    private _store: Store,
  ) { }

  ngOnChanges({ id }: SimpleChanges) {
    this.brand$ = this._store.select( BrandState.entitiesMap )
      .pipe(
        switchMap(entities => of( entities[ id.currentValue ] )),
      );
  }
}
