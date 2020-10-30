import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Slide, SlideState, Theme, ThemeState } from '@libCommon';
import { SetActive } from '@ngxs-labs/entity-state';

@Component({
  selector: 'editor-navigation',
  templateUrl: './editor-navigation.component.html',
  styleUrls: ['./editor-navigation.component.scss']
})
export class EditorNavigationComponent {

  @Select( SlideState.entities ) slides$: Observable<Slide[]>;
  @Select( SlideState.active ) active$: Observable<Slide>;
  @Select( ThemeState.active ) theme$: Observable<Theme>;

  readonly slideIcons = {
    landing: "home",
    photos:  "photo_library",
    videos:  "video_library"
  };

  constructor(
    private _store: Store,
  ) { }

  handleSelectPage(pageId: string): void {
    const slide = this._store.selectSnapshot( SlideState.getByTemplateId(pageId) );
    this._store.dispatch( new SetActive(SlideState, slide.id) );
  }
}
