import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { MatIconRegistry } from '@angular/material/icon';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
import { CurrentUserStateFactory } from './current-user/current-user.factory';
import { CurrentAccountGuard } from './current-account/current-account.guard';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: CurrentUserStateFactory,
      deps: [ Store ],
      multi: true,
    },
    {
      provide:  HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi:    true,
    },
    CurrentAccountGuard,
  ]
})
export class CoreModule {

  constructor(
    private _domSanitizer: DomSanitizer,
    private _matIconRegistry: MatIconRegistry,
    @Optional() @SkipSelf() parentModule?: CoreModule
  ) {
    // Do not allow multiple injections
    if ( parentModule ) {
      throw new Error('CoreModule has already been loaded. Import this module in the AppModule only.');
    }

    // Register icon sets
    this._matIconRegistry.addSvgIconSet(this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-twotone.svg'));
    this._matIconRegistry.addSvgIcon('brand_facebook', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/brand-facebook.svg'));
    this._matIconRegistry.addSvgIcon('brand_instagram', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/brand-instagram.svg'));
    this._matIconRegistry.addSvgIcon('brand_twitter', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/brand-twitter.svg'));
    this._matIconRegistry.addSvgIcon('brand_vimeo', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/brand-vimeo.svg'));
    this._matIconRegistry.addSvgIcon('brand_youtube', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/brand-youtube.svg'));
    this._matIconRegistry.addSvgIconSetInNamespace('mat_outline', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-outline.svg'));
    this._matIconRegistry.addSvgIconSetInNamespace('iconsmind', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/iconsmind.svg'));
    this._matIconRegistry.addSvgIconSetInNamespace('dripicons', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/dripicons.svg'));
    this._matIconRegistry.addSvgIconSetInNamespace('feather', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/feather.svg'));
    this._matIconRegistry.addSvgIconSetInNamespace('heroicons_outline', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-outline.svg'));
    this._matIconRegistry.addSvgIconSetInNamespace('heroicons_solid', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-solid.svg'));
  }
}
