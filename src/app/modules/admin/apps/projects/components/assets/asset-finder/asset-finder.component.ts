import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AssetDirectory, AssetElement, AssetElementFormat } from '@projects/lib-common/src/public-api';
import { MatDialog } from '@angular/material/dialog';

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
  @ViewChild('dialogCreateDirectory') dialogCreateDirectoryRef: TemplateRef<any>;
  
  constructor(
    private _store: Store,
    private _dialog: MatDialog,
  ) { }

  handleCreateDirectory(directory: AssetDirectory): void {
    this._openModal(this.dialogCreateDirectoryRef, { name: "" })
      .toPromise()
      .then(data => console.log('* handleCreateDirectory', data));
  }

  handleRemoveDirectory(directory: AssetDirectory): void {
    console.log('* handleRemoveDirectory', directory);
  }
  handleRemoveElement(element: AssetElement): void {
    console.log('* handleRemoveElement', element);
  }
  
  handleRenameDirectory(directory: AssetDirectory): void {
    const name = directory.name;
    this._openModal(this.dialogRenameRef, { name, original: name })
      .toPromise()
      .then(data => console.log('* handleRenameDirectory', data));
  }
  handleRenameElement(element: AssetElement): void {
    this._openModal(this.dialogRenameRef, { name: element.name, original: element.name })
      .toPromise()
      .then(data => console.log('* handleRenameElement', data));
  }

  handleMoveDirectory(directory: AssetDirectory): void {
    this._openModal(this.dialogMoveAssetRef, { id: directory.parentId })
      .toPromise()
      .then(data => console.log('* handleMoveDirectory', data));
  }
  handleMoveElement(element: AssetElement): void {
    this._openModal(this.dialogMoveAssetRef, { id: element.assetDirectoryId })
      .toPromise()
      .then(data => console.log('* handleMoveElement', data));
  }

  private _openModal(tmplRef: TemplateRef<any>, data: any): Observable<any> {
    const dialogRef = this._dialog.open(tmplRef, { data, width: "400px" });
    return dialogRef.afterClosed();
  }
}
