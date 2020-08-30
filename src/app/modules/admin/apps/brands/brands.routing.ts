import { Route } from '@angular/router';
import { BrandsComponent } from './brands.component';
import { BrandsListComponent } from './list/list.component';
import { BrandsDetailsComponent } from './details/details.component';
import { CanDeactivateBrandsGuard } from './brands.guard';

export const routes: Route[] = [
  {
    path: "",
    component: BrandsComponent,
    children: [
      {
        path: "",
        component: BrandsListComponent,
        children: [
          {
            path: ":id",
            component: BrandsDetailsComponent,
            canDeactivate: [ CanDeactivateBrandsGuard ],
          }
        ]
      }
    ]
  }
];
