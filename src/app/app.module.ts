import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { TreoModule } from '@treo';
import { TreoConfigModule } from '@treo/services/config';
import { TreoMockApiModule } from '@treo/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockDataServices } from 'app/data/mock';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import {
  AccountState,
  AppState,
  AuthState,
  BrandState,
  CurrentUserState,
  CurrentAccountState,
  ProjectState,
  LibCommonModule,
  UiState,
} from '../../projects/lib-common/src/public-api';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { environment } from 'environments/environment';

const routerConfig: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  preloadingStrategy: PreloadAllModules
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, routerConfig),

    // Treo & Treo Mock API
    TreoModule,
    TreoConfigModule.forRoot(appConfig),
    TreoMockApiModule.forRoot(mockDataServices),

    // Core
    CoreModule,
    LibCommonModule,

    // Layout
    LayoutModule,

    // 3rd party modules
    MarkdownModule.forRoot({}),

    // NGXS (last)
    NgxsModule.forRoot([
      AppState,
      UiState,
      AuthState,
      CurrentUserState,
      CurrentAccountState,
      AccountState,
      BrandState,
      ProjectState,
    ], {
      selectorOptions: {
        suppressErrors:       false,
        injectContainerState: false,
      },
      developmentMode: !environment.production,
    }),
    NgxsStoragePluginModule.forRoot({
      key: [ 'app' ]
    }),
    NgxsFormPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({ disabled: true }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
