import { Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { filter, find } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AssetDirectory, AssetDirectoryState, AssetElement, AssetElementFormat, AssetElementState } from '@projects/lib-common/src/public-api';

@Component({
  selector: 'asset-explorer',
  template: `
    <ng-template
      [ngTemplateOutlet]="templateRef"
      [ngTemplateOutletContext]="{
        activeDirectory: activeDirectory,
        directories: directories,
        elements: elements
      }">
    </ng-template>
  `
})
export class AssetExplorerComponent implements OnInit, OnDestroy {

  private _destroy$: Subject<boolean>    = new Subject();
  private _directoryId$: Subject<string> = new Subject();

  readonly Format = AssetElementFormat;

  elements: AssetElement[] = [];
  directories: AssetDirectory[] = [];
  activeDirectory: AssetDirectory;

  @Input() entityType: AssetElementFormat = AssetElementFormat.All;
  @ContentChild( TemplateRef ) templateRef: TemplateRef<any>;

  constructor(
    private _store: Store,
  ) { }

  ngOnInit() {
    this._directoryId$.pipe(
      takeUntil( this._destroy$ ),
      tap(dirId => this._mapToActiveDirectory( dirId )),
      tap(dirId => this._mapToDirectories( dirId )),
      tap(dirId => this._mapToElements( dirId )),
    )
    .subscribe();
    
    this._setActiveDirectory( null );
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.unsubscribe();
  }

  handleNavigateDirectory(id: string): void {
    this._setActiveDirectory( id );
  }

  private _setActiveDirectory(id: string): void {
    this._directoryId$.next( id );
  }

  private _mapToActiveDirectory(dirId: string): void {
    const dirs = this._store.selectSnapshot( AssetDirectoryState.entities );
    this.activeDirectory = find(dirs, [ 'id', dirId ]);
  }

  private _mapToDirectories(dirId: string): void {
    this.directories = this._store.selectSnapshot(
      AssetDirectoryState.descendants( dirId )
    );
  }

  private _mapToElements(dirId: string): void {
    const els = this._store.selectSnapshot( AssetElementState.descendants(dirId) );

    if (this.entityType !== AssetElementFormat.All) {
      this.elements = filter(els, [ 'format', this.entityType ]);
    }
    else {
      this.elements = els;
    }
  }
}
