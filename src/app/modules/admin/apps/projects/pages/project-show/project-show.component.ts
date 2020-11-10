import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TreoMediaWatcherService } from '@treo/services/media-watcher';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { flatMap, map, take, takeUntil, tap } from 'rxjs/operators';
import { ComponentCanDeactivate } from '../../guards';
import { EditorInspectorComponent } from '../../components/editor/editor-inspector/editor-inspector.component';
import { EditorChangeHistoryService } from 'app/modules/admin/apps/projects/services';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { ProjectActive, ProjectActiveState } from '@projects/lib-common/src/lib/states';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'project-show',
  templateUrl: './project-show.component.html',
  styleUrls: ['./project-show.component.scss']
})
export class ProjectShowComponent implements OnInit, AfterViewInit, OnDestroy, ComponentCanDeactivate {

  private _destroy$ = new Subject();

  selectedTabId$ = new BehaviorSubject( '' );
  
  drawerOpened: boolean;
  drawerMode: 'over' | 'side';
  scrollMode: 'inner' | 'drawer-content';
  isLoading: boolean = false;

  tabSelected: ElementRef;
  @ViewChildren('tab', { read: ElementRef }) tabs: QueryList<ElementRef>;

  @ViewChild('editorInspector', { static: false }) editorInspector: EditorInspectorComponent;

  get totalOfChanges(): number {
    return this._history.totalOfChanges;
  }

  constructor(
    actions$: Actions,
    snackBar: MatSnackBar,
    private _store: Store,
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

    actions$.pipe(
      ofActionSuccessful( ProjectActive.SaveAssociatedSlides ),
      takeUntil( this._destroy$ ),
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
    return this.editorInspector.canDeactivate();
  }

  handleTabChange(id: string): void {
    id && setTimeout(() => this.selectedTabId$.next( id ));
  }

  handleSaveProject(): void {
    this._store.dispatch( new ProjectActive.SaveAssociatedSlides() )
      .toPromise()
      .then(() => console.log('* Project Save completed'))
      .then(() => this._history.reset());
  }
}
