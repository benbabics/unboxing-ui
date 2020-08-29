import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Error404Component } from 'app/modules/admin/pages/errors/error-404/error-404.component';
import { error404Routes } from 'app/modules/admin/pages/errors/error-404/error-404.routing';

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild( error404Routes ),
  ],
  declarations: [
    Error404Component,
  ],
})
export class Error404Module { }
