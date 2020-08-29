import { Route } from '@angular/router';
import { AccountsComponent } from "./accounts/accounts.component";
import { ContextGuard } from "./guards/context.guard";

export const routes: Route[] = [
  {
    path: '',
    canActivate: [ ContextGuard ],
    component: AccountsComponent
  }
];
