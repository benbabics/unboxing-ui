import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreviewContainerComponent, PreviewLoadingComponent } from './components';


const routes: Routes = [
  {
    path: "",
    component: PreviewContainerComponent,
    children: [
      {
        path: "**",
        component: PreviewLoadingComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
