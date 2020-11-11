import { Component, Input, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { AssetDirectory, AssetElement, AssetElementFormat, ProjectActiveState } from '@projects/lib-common/src/public-api';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { isUndefined } from 'lodash';

@Component({
  selector: 'asset-finder',
  templateUrl: './asset-finder.component.html',
  styleUrls: ['./asset-finder.component.scss']
})
export class AssetFinderComponent {

  readonly Format = AssetElementFormat;
  
  @Input() entityType: AssetElementFormat = AssetElementFormat.All;

  @ViewChild('dialogRename') dialogRenameRef: TemplateRef<any>;
  @ViewChild('dialogMoveAsset') dialogMoveAssetRef: TemplateRef<any>;
  @ViewChild('dialogDeleteAsset') dialogDeleteAssetRef: TemplateRef<any>;
  @ViewChild('dialogCreateDirectory') dialogCreateDirectoryRef: TemplateRef<any>;
  
  constructor(
    private _store: Store,
    private _dialog: MatDialog,
  ) { }

  handleCreateDirectory(directory: AssetDirectory): void {
    this._openModal(this.dialogCreateDirectoryRef, { name: "" })
      .pipe(
        take( 1 ),
        filter(name => !!name),
        map(name => ({
          name,
          parentId: directory?.id || null,
          projectId: this._store.selectSnapshot( ProjectActiveState.projectId ),
        }))
      )
      .subscribe(payload => this._store.dispatch( new AssetDirectory.Create(payload) ));
  }

  handleRemoveDirectory(directory: AssetDirectory): void {
    this._openModal(this.dialogDeleteAssetRef, { resource: "folder" })
      .pipe(
        take( 1 ),
        filter(canDelete => !!canDelete),
      )
      .subscribe(() => this._store.dispatch( new AssetDirectory.Destroy(directory.id) ));
  }
  handleRemoveElement(element: AssetElement): void {
    console.log('* handleRemoveElement', element);
  }
  
  handleRenameDirectory(directory: AssetDirectory): void {
    const name = directory.name;
    this._openModal(this.dialogRenameRef, { name, original: name })
      .pipe(
        take( 1 ),
        filter(name => !!name),
        map(name => ({ name, id: directory.id })),
      )
      .subscribe(payload => this._store.dispatch( new AssetDirectory.Update(payload) ));
  }
  handleRenameElement(element: AssetElement): void {
    this._openModal(this.dialogRenameRef, { name: element.name, original: element.name })
      .pipe( take( 1 ) )
      .subscribe(data => console.log('* handleRenameElement', data));
  }

  handleMoveDirectory(directory: AssetDirectory): void {
    const id = directory.id;
    this._openModal(this.dialogMoveAssetRef, { id, original: id })
      .pipe(
        take( 1 ),
        filter(id => !isUndefined( id )),
        map(parentId => ({ parentId, id: directory.id })),
      )
      .subscribe(payload => this._store.dispatch( new AssetDirectory.Update(payload) ));
  }
  handleMoveElement(element: AssetElement): void {
    const id = element.assetDirectoryId;
    this._openModal(this.dialogMoveAssetRef, { id, original: id })
      .pipe(
        take( 1 ),
        filter(id => !isUndefined( id )),
      )
      .subscribe(data => console.log('* handleMoveElement', data));
  }

  private _openModal(tmplRef: TemplateRef<any>, data: any): Observable<any> {
    const dialogRef = this._dialog.open(tmplRef, { data, width: "400px" });
    return dialogRef.afterClosed();
  }
}
