import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  SettingsContainerComponent,
  SettingsAccountComponent,
  SettingsUiComponent,
} from './pages';


const routes: Routes = [
  {
    path: "",
    component: SettingsContainerComponent,
    data: {
      breadcrumb: "Settings"
    },
    children: [
      {
        path: "account",
        component: SettingsAccountComponent,
        data: {
          breadcrumb: "Personal Account"
        },
      },
      {
        path: "ui",
        component: SettingsUiComponent,
        data: {
          breadcrumb: "User Interface"
        },
      },
      {
        path: "",
        redirectTo: "ui"
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SettingsRoutingModule { }
