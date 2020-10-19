import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ProjectActiveState } from 'app/data';

@Component({
  selector: 'editor-navigator',
  templateUrl: './editor-navigator.component.html',
  styleUrls: ['./editor-navigator.component.scss']
})
export class EditorNavigatorComponent implements OnInit {

  url: string;

  constructor(
    private _store: Store,
  ) { }

  ngOnInit() {
    const host = document.location.host;
    const project = this._store.selectSnapshot( ProjectActiveState.project );
    this.url = `${ project.slug }.${ host }`;
  }
}
