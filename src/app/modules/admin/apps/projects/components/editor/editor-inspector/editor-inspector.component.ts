import { Component, TemplateRef, ViewChild } from '@angular/core';
import { get } from 'lodash';
import { Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { UpdateActive } from '@ngxs-labs/entity-state';
import { Observable, of, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { ComponentCanDeactivate } from '../../../guards';
import { EditorChangeHistoryService } from '../../../services';
import { Slide, SlideState, ThemeState, ThemeTemplate } from '@libCommon';

@Component({
  selector: 'editor-inspector',
  templateUrl: './editor-inspector.component.html',
  styleUrls: ['./editor-inspector.component.scss']
})
export class EditorInspectorComponent implements ComponentCanDeactivate {

  private _destroy$ = new Subject<boolean>();

  slide: Slide;
  template: ThemeTemplate;

  @ViewChild('dialogSaveChanges') dialogSaveChangesRef: TemplateRef<any>;

  get attributes(): any {
    return { ...this.slide.attributes };
  }
  
  get fields(): any[] {
    return get( this.template, 'fields', [] );
  }

  constructor(
    private _store: Store,
    private _dialog: MatDialog,
    private _history: EditorChangeHistoryService,
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

  canDeactivate(): Observable<boolean> {
    if ( this._history.totalOfChanges > 0 ) {
      const dialogRef = this._dialog.open( this.dialogSaveChangesRef );
      return dialogRef.afterClosed();
    }

    return of( true );
  }
  
  handleSlideAttributesUpdate(attributes: Slide): Observable<any> {
    return this._store.dispatch( new UpdateActive(SlideState, { attributes }) );
  }
}
