import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { 
  LandingComponent,
  PhotosComponent,
  VideosComponent,
  WrapperComponent
} from './pages';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    WrapperComponent,
    PhotosComponent,
    VideosComponent,
    LandingComponent,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
