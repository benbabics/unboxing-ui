import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AssetDirectory, AssetDirectoryState, AssetElement, AssetElementFormat, AssetElementState } from '@libCommon';

@Component({
  selector: 'asset-lists',
  templateUrl: './asset-lists.component.html',
  styleUrls: ['./asset-lists.component.scss']
})
export class AssetListsComponent {

  groupings$: Observable<{ directory: AssetDirectoryState, elements: AssetElement[] }[]>;

  @Input() entityType: AssetElementFormat = AssetElementFormat.All;
  
  @Input() iterationIds: string[];
  @Output() onSelectIterationIds = new EventEmitter();
  
  constructor(
    store: Store,
  ) {
    const buildGroup = (dirs: AssetDirectory[]) =>
      dirs.map(directory => ({ directory, elements: getElements( directory.id ) }));

    const getElements = (directoryId: string): AssetElement[] =>
      store.selectSnapshot(
        AssetElementState.descendants( directoryId, this.entityType )
      );

    this.groupings$ = <any>store.selectOnce( AssetDirectoryState.allPaths )
      .pipe(
        map(dirs  => buildGroup(dirs)),
        map(group => group.filter(({ elements }) => elements.length > 0)),
      );
  }

  handleSelectAssetIds(ids: string[] = []): void {
    this.onSelectIterationIds.emit( ids );
  }
}
