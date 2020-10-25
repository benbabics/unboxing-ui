import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { get, xor } from 'lodash';
import { AssetDirectory, AssetElement, AssetElementFormat } from 'app/data';
import { AssetIconComponent } from '../asset-icon/asset-icon.component';

interface AssetElementSelectable extends AssetElement {
  isSelected: boolean;
}

@Component({
  selector: 'asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements AfterViewInit {

  isLoading = true;
  selectables: AssetElementSelectable[] = [];
  eligibleIterationIds: string[] = [];
  
  @ViewChildren( 'assetIcon' ) assetIcons: QueryList<AssetIconComponent>;

  @Output() onSelectIterationIds = new EventEmitter();
  
  @Input() entityType: AssetElementFormat = AssetElementFormat.All;
  @Input() directory: AssetDirectory;
  @Input() elements: AssetElement[];
  @Input() iterationIds: string[];

  get isPhoto(): boolean {
    return this.entityType === AssetElementFormat.Photo;
  }
  get isVideo(): boolean {
    return this.entityType === AssetElementFormat.Video;
  }

  get areAllVisible(): boolean {
    return this.elements.length === this.eligibleIterationIds.length;
  }

  constructor(
    private ref: ChangeDetectorRef,
  ) { }

  ngAfterViewInit() {
    Promise.all(this.assetIcons.map(asset => asset.preload()))
      .then(() => this.isLoading = false)
      .then(() => get( this.ref, 'destroyed' ))
      .then(isDestroyed => !isDestroyed && this.ref.detectChanges());
  }

  ngOnChanges(changes: SimpleChanges) {
    const elementIds   = (get( this, 'elements', [] ) as any[]).map(({ id }) => id);
    const iterationIds = get( changes, 'iterationIds.currentValue', [] ) as string[];
    this.eligibleIterationIds = iterationIds.filter(id => elementIds.includes( id ));
  }

  handleSelectAssets(): void {
    const iterationIds = xor( this.iterationIds, this.eligibleIterationIds );

    if (this.areAllVisible) {
      this.onSelectIterationIds.emit( iterationIds );
    }
    else {
      const ids = this.elements.map(el => el.id);
      this.onSelectIterationIds.emit([ ...ids, ...iterationIds ]);
    }
  }

  handleSelectAsset(id: string) {
    const ids = xor( this.iterationIds, [ id ] );
    this.onSelectIterationIds.emit( ids );
  }
}
