import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { Slide, SlideState } from '@projects/lib-common/src/lib/states';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  @Select( SlideState.active ) slide$: Observable<Slide>;
}
