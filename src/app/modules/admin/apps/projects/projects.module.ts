import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { IvyGalleryModule } from 'angular-gallery';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
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
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
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
  AssetExplorerComponent,
  AssetFinderComponent,
  AssetIconComponent,
  AssetListsComponent,
  AssetListComponent,
  EditorNavigatorComponent,
  EditorContentComponent,
  EditorHistoryComponent,
  EditorInspectorComponent,
  EditorFormComponent,
  EditorNavigationComponent,
  EditorSettingsComponent,
  FontSelectorComponent,
  RoleBadgeComponent,
  UserAvatarComponent,
} from './components';
import {
  EditorChangeHistoryService,
} from './services';
import { TagIconPipe } from './pipes';

@NgModule({
  imports: [
    ProjectsRoutingModule,
    ReactiveFormsModule,
    NgxsFormPluginModule,
    IvyGalleryModule,
    MatAutocompleteModule,
    MatBadgeModule,
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
    MatListModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatToolbarModule,
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
    EditorHistoryComponent,
    EditorNavigationComponent,
    EditorSettingsComponent,
    AssetExplorerComponent,
    AssetFinderComponent,
    AssetListsComponent,
    AssetListComponent,
    AssetIconComponent,
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
    EditorChangeHistoryService,
  ]
})
export class ProjectsModule { }
