import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { Brand, BrandState } from '../../../../../../../../projects/lib-common/src/public-api';
import { BrandIndexComponent } from './../brand-index/brand-index.component';

@Component({
  selector: 'brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrls: ['./brand-edit.component.scss']
})
export class BrandEditComponent implements OnInit {

  brand$: Observable<Brand>;
  
  constructor(
    private _store: Store,
    private _activatedRoute: ActivatedRoute,
    private _brandIndexComponent: BrandIndexComponent,
  ) { }

  ngOnInit() {
    this.brand$ = this._activatedRoute.params
      .pipe(
        withLatestFrom( this._store.select(BrandState.entitiesMap) ),
        map(([ params, brands ]) => brands[ params.id ]),
      );
  }

  closeDrawer() {
    this._brandIndexComponent.closeDrawer();
  }
}
