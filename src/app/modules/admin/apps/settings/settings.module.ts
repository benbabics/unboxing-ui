import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { TreoNavigationModule } from '@treo/components/navigation/navigation.module';
import { SharedModule } from 'app/shared/shared.module';

import { SettingsState } from './states/settings.state';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsContainerComponent } from './pages/settings-container/settings-container.component';
import { SettingsSidebarComponent } from './components/settings-sidebar/settings-sidebar.component';
import { SettingsUiComponent } from './pages/settings-ui/settings-ui.component';


@NgModule({
  imports: [
    SettingsRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSidenavModule,
    TreoNavigationModule,
    SharedModule,
    NgxsModule.forFeature([
      SettingsState,
    ]),
    NgxsFormPluginModule,
  ],
  declarations: [
    SettingsContainerComponent,
    SettingsSidebarComponent,
    SettingsUiComponent,
  ],
})
export class SettingsModule { }
