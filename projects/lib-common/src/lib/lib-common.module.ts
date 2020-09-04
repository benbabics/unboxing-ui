import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { FormInspectorComponent } from './components';
import { ContenteditableDirective, StickyDirective } from './directives';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';

const components = [
  ContenteditableDirective,
  StickyDirective,
  FormInspectorComponent,
  BreadcrumbsComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ...components,
  ],
  exports: [
    ...components,
  ]
})
export class LibCommonModule { }
