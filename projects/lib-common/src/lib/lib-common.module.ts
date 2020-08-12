import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormInspectorComponent } from './components';
import { ContenteditableDirective, StickyDirective } from './directives';

const components = [
  ContenteditableDirective,
  StickyDirective,
  FormInspectorComponent,
];

@NgModule({
  imports: [
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
