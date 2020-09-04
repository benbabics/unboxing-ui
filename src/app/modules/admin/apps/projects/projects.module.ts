import { NgModule } from '@angular/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as moment from 'moment';
import { TreoCardModule } from '@treo/components/card';
import { TreoAutogrowModule } from '@treo/directives/autogrow';
import { TreoFindByKeyPipeModule } from '@treo/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { ProjectsRoutingModule } from './projects-routing.module';

import { ProjectContainerComponent } from './pages/project-container/project-container.component';
import { ProjectIndexComponent } from './pages/project-index/project-index.component';
import { ProjectEditComponent } from './pages/project-edit/project-edit.component';
import { ProjectShowComponent } from './pages/project-show/project-show.component';
import { ProjectNewComponent } from './pages/project-new/project-new.component';
import { ProjectSidebarComponent } from './components/project-sidebar/project-sidebar.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';


@NgModule({
  imports: [
    ProjectsRoutingModule,
    NgxsFormPluginModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    TreoCardModule,
    TreoAutogrowModule,
    TreoFindByKeyPipeModule,
    SharedModule,
  ],
  declarations: [
    ProjectContainerComponent,
    ProjectIndexComponent,
    ProjectEditComponent,
    ProjectShowComponent,
    ProjectNewComponent,
    ProjectSidebarComponent,
    ProjectFormComponent,
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
export class ProjectsModule { }
