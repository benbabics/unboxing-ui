import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
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
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as moment from 'moment';
import { TreoCardModule } from '@treo/components/card';
import { TreoAutogrowModule } from '@treo/directives/autogrow';
import { TreoFindByKeyPipeModule } from '@treo/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { ProjectsRoutingModule } from './projects-routing.module';

import { 
  BrandDetailComponent,
  BrandListComponent,
  BrandSelectorComponent,
  MemberTableComponent,
  ProjectFiltersComponent,
  ProjectFormComponent,
  ProjectResultComponent,
} from './components';
import { 
  ProjectIndexComponent,
  ProjectNewComponent,
  ProjectDetailComponent,
  ProjectEditComponent,
  ProjectShowComponent,
} from './pages';
import { 
  UserAvatarComponent,
  RoleBadgeComponent,
  EditorNavigatorComponent,
  EditorContentComponent
} from './components';
import { TagIconPipe } from './pipes';
import { EditorInspectorComponent } from './components/editor/editor-inspector/editor-inspector.component';
import { EditorFormComponent } from './components/editor/editor-form/editor-form.component';
import { AssetListsComponent } from './components/assets/asset-lists/asset-lists.component';
import { AssetListComponent } from './components/assets/asset-list/asset-list.component';
import { AssetIconComponent } from './components/assets/asset-icon/asset-icon.component';
import { EditorNavigationComponent } from './components/editor/editor-navigation/editor-navigation.component';
import { FontSelectorComponent } from './components/font-selector/font-selector.component';


@NgModule({
  imports: [
    ProjectsRoutingModule,
    ReactiveFormsModule,
    NgxsFormPluginModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
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
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    TreoCardModule,
    TreoAutogrowModule,
    TreoFindByKeyPipeModule,
    SharedModule,
  ],
  declarations: [
    BrandListComponent,
    BrandDetailComponent,
    BrandSelectorComponent,
    MemberTableComponent,
    ProjectFiltersComponent,
    ProjectFormComponent,
    ProjectIndexComponent,
    ProjectEditComponent,
    ProjectShowComponent,
    ProjectNewComponent,
    ProjectResultComponent,
    ProjectDetailComponent,
    TagIconPipe,
    UserAvatarComponent,
    RoleBadgeComponent,
    EditorNavigatorComponent,
    EditorContentComponent,
    EditorInspectorComponent,
    EditorFormComponent,
    AssetListsComponent,
    AssetListComponent,
    AssetIconComponent,
    EditorNavigationComponent,
    FontSelectorComponent,
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
