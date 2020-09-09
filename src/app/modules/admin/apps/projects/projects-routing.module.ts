import { ProjectIndexComponent } from './pages/project-index/project-index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { 
  ProjectNewComponent,
  ProjectShowComponent,
  ProjectEditComponent,
} from './pages';


const routes: Routes = [
  {
    path: "",
    component: ProjectIndexComponent,
  },
  {
    path: "new",
    component: ProjectNewComponent,
    canDeactivate: [],
  },
  {
    path: ":id",
    component: ProjectShowComponent,
    canDeactivate: [],
  },
  {
    path: ":id/edit",
    component: ProjectEditComponent,
    canDeactivate: [],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProjectsRoutingModule { }
