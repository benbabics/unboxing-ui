import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  ElementBindingDirective,
  FieldBindingDirective,
} from './directives';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ElementBindingDirective,
    FieldBindingDirective,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ElementBindingDirective,
    FieldBindingDirective,
  ]
})
export class SharedModule { }
