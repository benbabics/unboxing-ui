import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectContainerComponent } from './pages';


const routes: Routes = [
  {
    path: "",
    component: ProjectContainerComponent,
    children: [

    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProjectsRoutingModule { }
