import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { 
  ProjectNewComponent,
  ProjectIndexComponent,
  ProjectShowComponent,
  ProjectEditComponent,
} from './pages';
import {
  ProjectDetailGuard,
} from './guards';


const routes: Routes = [
  {
    path: "",
    data: {
      breadcrumb: "Projects"
    },
    children: [
      {
        path: "",
        component: ProjectIndexComponent,
      },
      {
        path: "new",
        component: ProjectNewComponent,
        canDeactivate: [],
        data: {
          breadcrumb: "New"
        },
      },
      {
        path: ":id",
        canActivate:      [ ProjectDetailGuard, ],
        canActivateChild: [ ProjectDetailGuard, ],
        canDeactivate:    [ ProjectDetailGuard, ],
        children: [
          {
            path: "",
            component: ProjectShowComponent,
          },
          {
            path: "edit",
            component: ProjectEditComponent,
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProjectsRoutingModule { }
