import { Component } from '@angular/core';
import { get } from 'lodash';
import { Store } from '@ngxs/store';
import { UpdateActive } from '@ngxs-labs/entity-state';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { Slide, SlideState, ThemeState, ThemeTemplate } from '@libCommon';

@Component({
  selector: 'editor-inspector',
  templateUrl: './editor-inspector.component.html',
  styleUrls: ['./editor-inspector.component.scss']
})
export class EditorInspectorComponent {

  private _destroy$ = new Subject<boolean>();

  slide: Slide;
  template: ThemeTemplate;

  get attributes(): any {
    return { ...this.slide.attributes };
  }
  
  get fields(): any[] {
    return get( this.template, 'fields', [] );
  }

  constructor(
    private _store: Store,
  ) {
    this._store.select( SlideState.active )
      .pipe(
        takeUntil( this._destroy$ ),
        filter(slide => !!slide),
        tap(slide => this.slide = slide),
        tap(({ templateId }) => {
          const template = ThemeState.findTemplate( templateId );
          this.template  = this._store.selectSnapshot( template );
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.unsubscribe();
  }

  handleSlideAttributesUpdate(attributes: Slide): Observable<any> {
    return this._store.dispatch( new UpdateActive(SlideState, { attributes }) );
  }
}
