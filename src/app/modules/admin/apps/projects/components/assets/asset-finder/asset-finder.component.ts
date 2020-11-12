import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { isUndefined } from 'lodash';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, take } from 'rxjs/operators';
import { AssetFormatPipe } from 'app/modules/admin/apps/projects/pipes';
import { AssetDirectory, AssetElement, AssetElementFormat, ProjectActiveState } from '@projects/lib-common/src/public-api';
import { Gallery } from 'angular-gallery';

@Component({
  selector: 'asset-finder',
  templateUrl: './asset-finder.component.html',
  styleUrls: ['./asset-finder.component.scss'],
  providers: [ AssetFormatPipe ]
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
    private _gallery: Gallery,
    private _dialog: MatDialog,
    private _assetFormat: AssetFormatPipe,
  ) { }

  handleCreateDirectory(directory: AssetDirectory): void {
    this._openDialog(this.dialogCreateDirectoryRef, { name: "" })
      .pipe(
        filter(name => !!name),
        map(name => ({
          name,
          parentId: directory?.id || null,
          projectId: this._store.selectSnapshot( ProjectActiveState.projectId ),
        }))
      )
      .subscribe(payload => this._store.dispatch( new AssetDirectory.Create(payload) ));
  }

  handlePreviewElement(element: AssetElement, elements: AssetElement[]): void {
    const images: any[] = elements.map(({ url }) => ({ path: url }));
    const index = elements.indexOf( element );
    this._gallery.load({ images, index });
  }

  handleRemoveDirectory(directory: AssetDirectory): void {
    this._dialogRemoveAsset({ resource: "folder" })
      .subscribe(() => this._store.dispatch( new AssetDirectory.Destroy(directory.id) ));
  }
  handleRemoveElement(element: AssetElement): void {
    let resource = this._assetFormat.transform( element.format );
    this._dialogRemoveAsset({ resource })
      .subscribe(() => this._store.dispatch( new AssetElement.Destroy(element.id) ));
  }
  
  handleRenameDirectory(directory: AssetDirectory): void {
    const name = directory.name;
    this._dialogRenameAsset({ name, original: name })
      .pipe( map(name => ({ name, id: directory.id })) )
      .subscribe(payload => this._store.dispatch( new AssetDirectory.Update(payload) ));
  }
  handleRenameElement(element: AssetElement): void {
    this._dialogRenameAsset({ name: element.name, original: element.name })
      .pipe( map(name => ({ name, id: element.id })) )
      .subscribe(payload => this._store.dispatch(new AssetElement.Update(payload)));
  }
  
  handleMoveDirectory(directory: AssetDirectory): void {
    const id = directory.id;
    this._dialogMoveAsset({ id, original: id })
      .pipe( map(parentId => ({ parentId, id: directory.id })) )
      .subscribe(payload => this._store.dispatch( new AssetDirectory.Update(payload) ));
  }
  handleMoveElement(element: AssetElement): void {
    const id = element.assetDirectoryId;
    this._dialogMoveAsset({ id, original: id })
      .pipe( map(assetDirectoryId => ({ assetDirectoryId, id: element.id })) )
      .subscribe(payload => this._store.dispatch( new AssetElement.Update(payload) ));
  }

  private _dialogRemoveAsset(payload): Observable<any> {
    return this._openDialog(this.dialogDeleteAssetRef, payload)
      .pipe( filter(canDelete => !!canDelete) );
  }

  private _dialogRenameAsset(payload): Observable<any> {
    return this._openDialog( this.dialogRenameRef, payload )
      .pipe( filter(name => !!name) );
  }

  private _dialogMoveAsset(payload): Observable<any> {
    return this._openDialog( this.dialogMoveAssetRef, payload )
      .pipe( filter(id => !isUndefined( id )) );
  }
  
  private _openDialog(tmplRef: TemplateRef<any>, data: any): Observable<any> {
    const dialogRef = this._dialog.open(tmplRef, { data, width: "400px" });
    return dialogRef.afterClosed().pipe( take( 1 ) );
  }
}
