import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { get } from 'lodash';
import { Select, Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { UpdateActive } from '@ngxs-labs/entity-state';
import { Observable, of, Subject } from 'rxjs';
import { delay, filter, flatMap, map, mapTo, take, takeUntil, tap } from 'rxjs/operators';
import { ComponentCanDeactivate } from '../../../guards';
import { EditorChangeHistoryService } from '../../../services';
import { ProjectActive, ProjectActiveState, Slide, SlideState, ThemeState, ThemeTemplate } from '@libCommon';

@Component({
  selector: 'editor-inspector',
  templateUrl: './editor-inspector.component.html',
  styleUrls: ['./editor-inspector.component.scss']
})
export class EditorInspectorComponent implements OnDestroy, ComponentCanDeactivate {

  private _destroy$ = new Subject<boolean>();

  slide: Slide;
  template: ThemeTemplate;
  actionDialogSaveChanges = new Subject();
  isLoading: boolean = false;

  @ViewChild( 'dialogSaveChanges' ) dialogSaveChangesRef: TemplateRef<any>;

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

    this._store.select( ProjectActiveState.isLoading )
      .pipe(
        takeUntil( this._destroy$ ),
        tap(isLoading => this.isLoading = isLoading),
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

      this.actionDialogSaveChanges.pipe(
        take( 1 ),
        flatMap(action => {
          if ( action === "SAVE" ) {
            return this._store.dispatch( new ProjectActive.SaveAssociatedSlides() )
              .pipe( mapTo(action) );
          }

          return of( action );
        }),
        map(action => action !== "CANCEL"),
        tap(result => dialogRef.close( result )),
      )
      .subscribe();

      return dialogRef.afterClosed();
    }

    return of( true );
  }
  
  handleSlideAttributesUpdate(attributes: Slide): Observable<any> {
    return this._store.dispatch( new UpdateActive(SlideState, { attributes }) );
  }
}
