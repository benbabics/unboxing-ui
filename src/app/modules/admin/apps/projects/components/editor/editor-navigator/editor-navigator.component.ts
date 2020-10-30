import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ProjectActiveState, Slide, SlideState } from '@libCommon';
import { Observable } from 'rxjs';

@Component({
  selector: 'editor-navigator',
  templateUrl: './editor-navigator.component.html',
  styleUrls: ['./editor-navigator.component.scss']
})
export class EditorNavigatorComponent implements OnInit {

  url: string;

  @Select( SlideState.active ) slide$: Observable<Slide>;

  constructor(
    private _store: Store,
  ) { }

  ngOnInit() {
    const host = document.location.host;
    const project = this._store.selectSnapshot( ProjectActiveState.project );
    this.url = `${ project.slug }.${ host }`;
  }
}
