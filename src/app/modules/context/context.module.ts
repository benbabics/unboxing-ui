import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContextGuard } from './guards/context.guard';
import { AccountsComponent } from './accounts/accounts.component';
import { routes } from './context.routing';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxsModule } from '@ngxs/store';
import { TreoMessageModule } from '@treo/components/message';
import { SharedModule } from 'app/shared/shared.module';
import { TreoCardModule } from '@treo/components/card';
import { MembershipState } from './states';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TreoCardModule,
    TreoMessageModule,
    SharedModule,
    NgxsModule.forFeature([
      MembershipState,
    ]),
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
