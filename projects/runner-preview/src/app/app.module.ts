import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { NgxsModule } from '@ngxs/store';
import { NgxSpinnerModule } from "ngx-spinner";
import { PostMessageModule } from '@tekool/ngx-post-message-angular-9';

import { AppComponent } from './app.component';
import { 
  PreviewContainerComponent,
  PreviewLoadingComponent
} from './components';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxSpinnerModule,
    PostMessageModule,
    NgxsModule.forRoot([
    ]),
  ],
  declarations: [
    AppComponent,
    PreviewContainerComponent,
    PreviewLoadingComponent,
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
