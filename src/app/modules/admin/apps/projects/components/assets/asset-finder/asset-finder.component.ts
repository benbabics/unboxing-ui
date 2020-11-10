import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { filter, find } from 'lodash';
import { AssetDirectory, AssetDirectoryState, AssetElement, AssetElementFormat, AssetElementState } from '@projects/lib-common/src/public-api';

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
  
  constructor(
    private store: Store,
  ) { }

  ngOnInit() {
    this._directoryId$.pipe(
      takeUntil(this._destroy$),
      tap(dirId => this.mapToActiveDirectory(dirId)),
      tap(dirId => this.mapToDirectories(dirId)),
      tap(dirId => this.mapToElements(dirId)),
    )
    .subscribe();
    
    this.setActiveDirectory(null);
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  directoryDetails(id: string): any {
    const isIterationId = id => this.iterationIds.includes(id);
    const ancestors = this.store.selectSnapshot(AssetDirectoryState.ancestors(id)).map(dir => dir.id);

    return {
      id,
      isChecked:  [ ...ancestors, id ].some(isIterationId),
      isDisabled: ancestors.some(isIterationId),
    }
  }

  isDirectoryIdSelected(id: string): boolean {
    const ancestors = this.store.selectSnapshot(AssetDirectoryState.ancestors(id));
    return ancestors.some(dir => this.iterationIds.includes(dir.id));
  }

  handleNavigateDirectory(id: string): void {
    this.setActiveDirectory(id);
  }

  handleSelectDirectory(id: string): void {
    this.onSelectIterationIds.emit([ id ]);
  }
  
  private setActiveDirectory(id: string): void {
    this._directoryId$.next(id);
  }

  private mapToActiveDirectory(dirId: string): void {
    const dirs = this.store.selectSnapshot(AssetDirectoryState.entities);
    this.activeDirectory = find(dirs, ['id', dirId]);
  }

  private mapToDirectories(dirId: string): void {
    this.directories = this.store.selectSnapshot(
      AssetDirectoryState.descendants(dirId)
    );
  }

  private mapToElements(dirId: string): void {
    const els = this.store.selectSnapshot(AssetElementState.descendants(dirId));

    if (this.entityType !== AssetElementFormat.All) {
      this.elements = filter(els, ['format', this.entityType]);
    }
    else {
      this.elements = els;
    }
  }
}
