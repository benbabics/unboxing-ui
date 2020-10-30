import { Component, Input } from '@angular/core';
import { AssetDirectory, AssetElement, AssetElementFormat } from '@libCommon';
import { get } from 'lodash';

@Component({
  selector: 'asset-icon',
  templateUrl: './asset-icon.component.html',
  styleUrls: ['./asset-icon.component.scss']
})
export class AssetIconComponent {

  readonly Format = AssetElementFormat;

  @Input() asset: AssetDirectory | AssetElement;

  get assetFormat(): AssetElementFormat {
    return get( this.asset, 'format' );
  }
  get assetName(): string {
    return get( this.asset, 'name' );
  }

  get assetUrl(): string {
    return get( this.asset, 'url', '/assets/images/shared/image-not-found.png' );
  }

  preload(): Promise<any> {
    switch (this.assetFormat) {
      case AssetElementFormat.Photo:
        return this._preloadImage( this.assetUrl );

      default:
        return Promise.resolve();
    }
  }

  private _preloadImage(src: string): Promise<void> {
    return new Promise(resolve => {
      const img = new Image();
      img.src = src;
      img.onload  = () => resolve();
      img.onerror = () => resolve();
    });
  }
}
