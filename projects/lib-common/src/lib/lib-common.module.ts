import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
  SigninComponent,
  SignoutComponent,
  SignupComponent,
  FormInspectorComponent,
  SpinnerComponent,
} from './components';
import {
  ContenteditableDirective,
  StickyDirective,
} from './directives';

const components = [
  ContenteditableDirective,
  StickyDirective,
  FormInspectorComponent,
  SigninComponent,
  SignoutComponent,
  SignupComponent,
  SpinnerComponent,
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
