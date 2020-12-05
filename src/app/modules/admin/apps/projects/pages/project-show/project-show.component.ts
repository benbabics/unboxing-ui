import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { TreoMediaWatcherService } from '@treo/services/media-watcher';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, flatMap, map, mapTo, take, takeUntil, tap } from 'rxjs/operators';
import { ComponentCanDeactivate } from '../../guards';
import { EditorInspectorComponent } from '../../components/editor/editor-inspector/editor-inspector.component';
import { EditorChangeHistoryService } from 'app/modules/admin/apps/projects/services';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { ProjectActive, ProjectActiveState, SlideState, UiPreferencesState } from '@projects/lib-common/src/lib/states';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EntityActionType, ofEntityActionSuccessful } from '@ngxs-labs/entity-state';

@Component({
  selector: 'project-show',
  templateUrl: './project-show.component.html',
  styleUrls: ['./project-show.component.scss']
})
export class ProjectShowComponent implements OnInit, AfterViewInit, OnDestroy, ComponentCanDeactivate {

  private _destroy$ = new Subject();

  selectedTabId$ = new BehaviorSubject( '' );
  actionDialogSaveChanges = new Subject();
  
  drawerOpened: boolean;
  drawerMode: 'over' | 'side';
  scrollMode: 'inner' | 'drawer-content';
  isLoading: boolean = false;
  isAutoSaveEnabled: boolean = false;

  tabSelected: ElementRef;
  @ViewChildren('tab', { read: ElementRef }) tabs: QueryList<ElementRef>;

  @ViewChild('editorInspector', { static: false }) editorInspector: EditorInspectorComponent;
  @ViewChild('dialogSaveChanges') dialogSaveChangesRef: TemplateRef<any>;

  get totalOfChanges(): number {
    return this._history.totalOfChanges;
  }

  constructor(
    actions$: Actions,
    snackBar: MatSnackBar,
    private _store: Store,
    private _dialog: MatDialog,
    private _history: EditorChangeHistoryService,
    private _treoMediaWatcherService: TreoMediaWatcherService,
  ) {
    this.drawerOpened = true;
    this.drawerMode = 'side';
    this.scrollMode = 'inner';

    this._store.select( ProjectActiveState.isLoading )
      .pipe(
        takeUntil( this._destroy$ ),
        tap(isLoading => this.isLoading = isLoading),
      )
      .subscribe();

    this._store.select( UiPreferencesState.projectSettingAutoSave )
      .pipe(
        takeUntil( this._destroy$ ),
        tap(isEnabled => this.isAutoSaveEnabled = isEnabled),
        filter(() => this.isAutoSaveEnabled),
        tap(() => this.handleSaveProject()),
      )
      .subscribe();

    actions$.pipe(
      ofEntityActionSuccessful( SlideState, EntityActionType.UpdateActive ),
      takeUntil( this._destroy$ ),
      filter(() => this.isAutoSaveEnabled),
      debounceTime( 500 ),
      tap(() => this.handleSaveProject()),
    )
    .subscribe();

    actions$.pipe(
      ofActionSuccessful( ProjectActive.SaveAssociatedSlides ),
      takeUntil( this._destroy$ ),
      filter(() => !this.isAutoSaveEnabled),
      flatMap(() => _store.selectOnce( ProjectActiveState.project )),
      tap(({ title }) => snackBar.open( `${ title } was updated successfully.`, `Ok` )),
    )
    .subscribe();
  }

  ngOnInit() {
    setTimeout(() => this._history.reset());
    
    this._treoMediaWatcherService.onMediaChange$
      .pipe( takeUntil(this._destroy$) )
      .subscribe(({ matchingAliases }) => {
        if (matchingAliases.includes('lt-lg')) {
          this.drawerOpened = false;
          this.drawerMode = 'over';
        }
        else {
          this.drawerOpened = true;
          this.drawerMode = 'side';
        }
      });
  }

  ngAfterViewInit() {
    this.selectedTabId$.subscribe(id => {
      const tab = this.tabs.find(({ nativeElement }) => nativeElement.getAttribute( 'value' ) === id);
      if (tab) this.tabSelected = tab;
    });
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  canDeactivate(): Observable<boolean> {
    if ( this._history.totalOfChanges > 0 && !this.isAutoSaveEnabled ) {
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

  handleTabChange(id: string): void {
    id && setTimeout(() => this.selectedTabId$.next( id ));
  }

  handleSaveProject(): void {
    this._store.dispatch( new ProjectActive.SaveAssociatedSlides() )
      .pipe(
        take( 1 ),
        filter(() => !this.isAutoSaveEnabled),
        tap(() => this._history.reset()),
      )
      .subscribe();
  }
}
