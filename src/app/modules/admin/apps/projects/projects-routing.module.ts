import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { 
  ProjectNewComponent,
  ProjectIndexComponent,
  ProjectDetailComponent,
  ProjectShowComponent,
  ProjectEditComponent,
} from './pages';
import { ProjectResolver } from './resolvers';
import { ProjectFormGuard } from './guards';


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
        data: { breadcrumb: "New" },
        canDeactivate: [ ProjectFormGuard ],
      },
      {
        path: ":id",
        component: ProjectDetailComponent,
        resolve: {
          project: ProjectResolver,
        },
        children: [
          {
            path: "",
            data: { breadcrumb: "View" },
            canDeactivate: [ ProjectFormGuard, ],
            component: ProjectShowComponent,
          },
          {
            path: "edit",
            data: { breadcrumb: "Edit" },
            canDeactivate: [ ProjectFormGuard, ],
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
