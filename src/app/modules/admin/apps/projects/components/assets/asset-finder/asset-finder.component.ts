import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { filter, find } from 'lodash';
import { AssetDirectory, AssetDirectoryState, AssetElement, AssetElementFormat, AssetElementState } from '@projects/lib-common/src/public-api';
import { ClearActive, SetActive } from '@ngxs-labs/entity-state';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'asset-finder',
  templateUrl: './asset-finder.component.html',
  styleUrls: ['./asset-finder.component.scss']
})
export class AssetFinderComponent implements OnInit, OnDestroy {

  private _destroy$: Subject<boolean>    = new Subject();
  private _directoryId$: Subject<string> = new Subject();

  readonly Format = AssetElementFormat;

  elements: AssetElement[] = [];
  directories: AssetDirectory[] = [];
  activeDirectory: AssetDirectory;

  @Input() entityType: AssetElementFormat = AssetElementFormat.All;
  @Input() iterationIds: string[] = [];

  @Output() onSelectIterationIds = new EventEmitter();

  @ViewChild('dialogRename') dialogRenameRef: TemplateRef<any>;
  @ViewChild('dialogMoveAsset') dialogMoveAssetRef: TemplateRef<any>;
  @ViewChild('dialogCreateDirectory') dialogCreateDirectoryRef: TemplateRef<any>;
  
  constructor(
    private _store: Store,
    private _dialog: MatDialog,
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

  directoryDetails(id: string): any {
    const isIterationId = id => this.iterationIds.includes( id );
    const ancestors = this._store.selectSnapshot( AssetDirectoryState.ancestors(id) ).map(dir => dir.id);

    return {
      id,
      isChecked:  [ ...ancestors, id ].some( isIterationId ),
      isDisabled: ancestors.some( isIterationId ),
    }
  }

  isDirectoryIdSelected(id: string): boolean {
    const ancestors = this._store.selectSnapshot( AssetDirectoryState.ancestors(id) );
    return ancestors.some(dir => this.iterationIds.includes( dir.id ));
  }

  handleNavigateDirectory(id: string): void {
    this._setActiveDirectory( id );
  }

  handleSelectDirectory(id: string): void {
    this.onSelectIterationIds.emit([ id ]);
  }

  handleElementMenuOpened(id: string): void {
    this._store.dispatch( new SetActive(AssetElementState, id) );
  }
  handleElementMenuClosed(): void {
    this._store.dispatch( new ClearActive(AssetElementState) );
  }

  handleCreateDirectory(): void {
    this._openModal(this.dialogCreateDirectoryRef, { name: "" })
      .toPromise()
      .then(data => console.log('* handleCreateDirectory', data));
  }

  handleRemoveDirectory(): void {
    console.log('* handleRemoveDirectory', this.activeDirectory);
  }
  handleRemoveElement(): void {
    const element = this._store.selectSnapshot( AssetElementState.active );
    console.log('* handleRemoveElement', element);
  }
  
  handleRenameDirectory(): void {
    const name = this.activeDirectory.name;
    this._openModal(this.dialogRenameRef, { name, original: name })
      .toPromise()
      .then(data => console.log('* handleRenameDirectory', data));
  }
  handleRenameElement(): void {
    const element = this._store.selectSnapshot( AssetElementState.active );
    this._openModal(this.dialogRenameRef, { name: element.name, original: element.name })
      .toPromise()
      .then(data => console.log('* handleRenameElement', data));
  }

  handleMoveDirectory(): void {
    this._openModal(this.dialogMoveAssetRef, { id: this.activeDirectory.parentId })
      .toPromise()
      .then(data => console.log('* handleMoveDirectory', data));
  }
  handleMoveElement(): void {
    const element = this._store.selectSnapshot( AssetElementState.active );
    this._openModal(this.dialogMoveAssetRef, { id: element.assetDirectoryId })
      .toPromise()
      .then(data => console.log('* handleMoveElement', data));
  }

  private _openModal(tmplRef: TemplateRef<any>, data: any): Observable<any> {
    const dialogRef = this._dialog.open(tmplRef, { data, width: "400px" });
    return dialogRef.afterClosed();
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
