import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Brand } from '../../../../../../../../projects/lib-common/src/public-api';
import { BrandIndexComponent } from './../brand-index/brand-index.component';

@Component({
  selector: 'brand-new',
  templateUrl: './brand-new.component.html',
  styleUrls: ['./brand-new.component.scss']
})
export class BrandNewComponent implements OnInit {

  brand: Brand;
  
  constructor(
    private _store: Store,
    private _brandIndexComponent: BrandIndexComponent,
  ) { }

  ngOnInit() {
    this.brand = <Brand>{ };
  }

  closeDrawer() {
    this._brandIndexComponent.closeDrawer();
  }
}
