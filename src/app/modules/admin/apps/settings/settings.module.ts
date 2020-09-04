import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { TreoNavigationModule } from '@treo/components/navigation/navigation.module';
import { SharedModule } from 'app/shared/shared.module';

import { SettingsState } from './states/settings.state';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsContainerComponent } from './pages/settings-container/settings-container.component';
import { SettingsFormComponent } from './components/settings-form/settings-form.component';
import { SettingsSidebarComponent } from './components/settings-sidebar/settings-sidebar.component';
import { SettingsUiComponent } from './pages/settings-ui/settings-ui.component';
import { SettingsAccountComponent } from './pages/settings-account/settings-account.component';


@NgModule({
  imports: [
    SettingsRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTooltipModule,
    TreoNavigationModule,
    SharedModule,
    NgxsModule.forFeature([
      SettingsState,
    ]),
    NgxsFormPluginModule,
  ],
  declarations: [
    SettingsContainerComponent,
    SettingsFormComponent,
    SettingsSidebarComponent,
    SettingsUiComponent,
    SettingsAccountComponent,
  ],
  providers: [
    { 
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition:   'bottom',
      }
    },
  ]
})
export class SettingsModule { }
