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
    AppRoutingModule,
    NgxSpinnerModule,
    PostMessageModule,
    NgxsModule.forFeature([
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
