import { Pipe, PipeTransform } from '@angular/core';
import { AssetElementFormat } from '@projects/lib-common/src/public-api';

@Pipe({
  name: 'assetFormat'
})
export class AssetFormatPipe implements PipeTransform {

  transform(value: string): string {
    switch( value ) {
      case AssetElementFormat.Photo: return "photo";
      case AssetElementFormat.Video: return "video";
    }
  }
}
