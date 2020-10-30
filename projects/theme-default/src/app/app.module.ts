import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibCommonModule } from '@libCommon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  FontFamilyDirective,
} from './directives';
import {
  AssetService,
  CarouselPhotosService,
  CarouselVideosService,
} from './services';
import {
  ImageLoaderComponent,
  VideoPlayerComponent,
} from './components';
import { 
  LandingComponent,
  PhotosComponent,
  VideosComponent,
  WrapperComponent
} from './pages';

@NgModule({
  imports: [
    CommonModule,
    LibCommonModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    WrapperComponent,
    PhotosComponent,
    VideosComponent,
    LandingComponent,
    FontFamilyDirective,
    ImageLoaderComponent,
    VideoPlayerComponent,
  ],
  providers: [
    AssetService,
    CarouselPhotosService,
    CarouselVideosService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
