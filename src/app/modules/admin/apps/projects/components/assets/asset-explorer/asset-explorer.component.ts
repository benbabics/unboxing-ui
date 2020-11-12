import { Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, find } from 'lodash';
import { Subject } from 'rxjs';
import { map, mapTo, takeUntil, tap } from 'rxjs/operators';
import { Actions, Store } from '@ngxs/store';
import { EntityActionType, ofEntityActionSuccessful } from '@ngxs-labs/entity-state';
import { AssetDirectory, AssetDirectoryState, AssetElement, AssetElementFormat, AssetElementState } from '@projects/lib-common/src/public-api';
import { AssetFormatPipe } from 'app/modules/admin/apps/projects/pipes';

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
  `,
  providers: [ AssetFormatPipe ]
})
export class AssetExplorerComponent implements OnInit, OnDestroy {

  private _destroy$: Subject<boolean>    = new Subject();
  private _directoryId$: Subject<string> = new Subject();

  readonly Format = AssetElementFormat;

  elements: AssetElement[] = [];
  directories: AssetDirectory[] = [];
  activeDirectory: AssetDirectory;

  @Input() directoryId: string = null;
  @Input() entityType: AssetElementFormat = AssetElementFormat.All;
  @ContentChild( TemplateRef ) templateRef: TemplateRef<any>;

  constructor(
    actions$: Actions,
    snackBar: MatSnackBar,
    private _store: Store,
    private _assetFormat: AssetFormatPipe,
  ) {
    actions$.pipe(
      ofEntityActionSuccessful( AssetDirectoryState, EntityActionType.Add ),
      takeUntil( this._destroy$ ),
      map(({ payload }) => payload),
      tap(({ name }) => snackBar.open(`The folder "${ name }" has been created.`, `Ok`)),
      tap(({ parentId }) => this._setActiveDirectory( parentId )),
    )
      .subscribe();
    
    actions$.pipe(
      ofEntityActionSuccessful( AssetDirectoryState, EntityActionType.Update ),
      takeUntil( this._destroy$ ),
      map(({ payload }) => payload.data),
      tap(({ name }) => snackBar.open(`The folder "${ name }" has been updated.`, `Ok`)),
      tap(({ id }) => this._setActiveDirectory( id )),
    )
      .subscribe();

    actions$.pipe(
      ofEntityActionSuccessful( AssetElementState, EntityActionType.Update ),
      takeUntil( this._destroy$ ),
      map(({ payload }) => ({ ...payload.data, resource: this._assetFormat.transform( payload.data.format ) })),
      tap(({ name, resource }) => snackBar.open(`The ${ resource } "${ name }" has been updated.`, `Ok`)),
      tap(({ assetDirectoryId }) => this._setActiveDirectory( assetDirectoryId )),
    )
      .subscribe();

    actions$.pipe(
      ofEntityActionSuccessful( AssetDirectoryState, EntityActionType.Remove ),
      takeUntil( this._destroy$ ),
      map(() => this.activeDirectory),
      tap(({ name }) => snackBar.open(`The folder "${ name }" was deleted.`, `Ok`)),
      tap(({ parentId }) => this._setActiveDirectory( parentId || null )),
    )
      .subscribe();

    actions$.pipe(
      ofEntityActionSuccessful( AssetElementState, EntityActionType.Remove ),
      takeUntil( this._destroy$ ),
      tap(() => snackBar.open(`The media was deleted.`, `Ok`)),
      tap(() => this._setActiveDirectory( this.activeDirectory.id )),
    )
      .subscribe();
  }

  ngOnInit() {
    this._directoryId$.pipe(
      takeUntil( this._destroy$ ),
      tap(dirId => this._mapToActiveDirectory( dirId )),
      tap(dirId => this._mapToDirectories( dirId )),
      tap(dirId => this._mapToElements( dirId )),
    )
    .subscribe();
    
    this._setActiveDirectory( this.directoryId );
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
