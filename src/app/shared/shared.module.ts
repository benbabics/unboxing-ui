import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LibCommonModule } from '../../../projects/lib-common/src/public-api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LibCommonModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LibCommonModule,
  ]
})
export class SharedModule { }
