import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  LandingComponent,
  PhotosComponent,
  VideosComponent,
  WrapperComponent,
} from './pages';


const routes: Routes = [
  {
    path: "",
    component: WrapperComponent,
    data: {
      isThemeWrapper: true,
    },
    children: [
      {
        path: "landing",
        component: LandingComponent,
      },
      {
        path: "photos",
        component: PhotosComponent,
      },
      {
        path: "videos",
        component: VideosComponent,
      },

      { path: "**", redirectTo: "landing" },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
