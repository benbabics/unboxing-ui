import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TreoMediaWatcherService } from '@treo/services/media-watcher';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComponentCanDeactivate } from '../../guards';
import { EditorInspectorComponent } from '../../components/editor/editor-inspector/editor-inspector.component';
import { EditorChangeHistoryService } from 'app/modules/admin/apps/projects/services';

@Component({
  selector: 'project-show',
  templateUrl: './project-show.component.html',
  styleUrls: ['./project-show.component.scss']
})
export class ProjectShowComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  private _destroy$ = new Subject();
  
  drawerOpened: boolean;
  drawerMode: 'over' | 'side';
  scrollMode: 'inner' | 'drawer-content';

  @ViewChild('editorInspector', { static: false }) editorInspector: EditorInspectorComponent;

  get totalOfChanges(): number {
    return this._history.totalOfChanges;
  }

  constructor(
    private _history: EditorChangeHistoryService,
    private _treoMediaWatcherService: TreoMediaWatcherService,
  ) {
    this.drawerOpened = true;
    this.drawerMode = 'side';
    this.scrollMode = 'inner';
  }

  ngOnInit() {
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

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  canDeactivate(): Observable<boolean> {
    return this.editorInspector.canDeactivate();
  }

  handleSaveProject(): void {
    console.log('* handleSaveProject');
    this._history.reset();
  }
}
