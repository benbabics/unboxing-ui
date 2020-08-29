import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContextGuard } from './guards/context.guard';
import { AccountsComponent } from './accounts/accounts.component';
import { routes } from './context.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
  ],
  providers: [
    ContextGuard,
  ],
  declarations: [
    AccountsComponent,
  ],
  exports: [
    AccountsComponent,
  ]
})
export class ContextModule { }
