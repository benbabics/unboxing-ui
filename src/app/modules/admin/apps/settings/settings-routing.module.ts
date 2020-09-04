import { SettingsUiComponent } from './pages/settings-ui/settings-ui.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsContainerComponent } from './pages/settings-container/settings-container.component';


const routes: Routes = [
  {
    path: "",
    component: SettingsContainerComponent,
    data: {
      breadcrumb: "Settings"
    },
    children: [
      {
        path: "ui",
        component: SettingsUiComponent,
        data: {
          breadcrumb: "User Interface"
        },
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SettingsRoutingModule { }
