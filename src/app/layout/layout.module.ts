import { NgModule } from '@angular/core';
import { LayoutComponent } from 'app/layout/layout.component';
import { DenseLayoutModule } from './layouts/dense/dense.module';
import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module';
import { FuturisticLayoutModule } from 'app/layout/layouts/futuristic/futuristic.module';

import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    LayoutComponent,
  ],
  imports: [
    SharedModule,
    DenseLayoutModule,
    EmptyLayoutModule,
    FuturisticLayoutModule,
  ],
  exports: [
    DenseLayoutModule,
    EmptyLayoutModule,
    FuturisticLayoutModule,
  ]
})
export class LayoutModule { }
