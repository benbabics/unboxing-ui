import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CanDeactivateBrandsGuard } from './brands.guard';
import { BrandIndexComponent, BrandNewComponent, BrandEditComponent, BrandShowComponent } from './pages';


export const routes: Route[] = [
  {
    path: "",
    component: BrandIndexComponent,
    children: [
      {
        path: "new",
        component: BrandNewComponent,
        canDeactivate: [ CanDeactivateBrandsGuard ],
      },
      {
        path: ":id",
        component: BrandShowComponent,
        canDeactivate: [ CanDeactivateBrandsGuard ],
      },
      {
        path: ":id/edit",
        component: BrandEditComponent,
        canDeactivate: [ CanDeactivateBrandsGuard ],
      }
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class BrandsRoutingModule { }
