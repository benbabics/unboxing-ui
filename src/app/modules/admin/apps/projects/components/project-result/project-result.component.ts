import { Component, Input, SimpleChanges } from '@angular/core';
import { get } from 'lodash';
import { AssetElement } from 'app/data';

@Component({
  selector: 'project-result',
  templateUrl: './project-result.component.html',
  styleUrls: ['./project-result.component.scss']
})
export class ProjectResultComponent {

  @Input() isLoading: boolean = true;
  @Input() project: any;
  
  assets: AssetElement[] = [];
  assetsCount: number = 0;
  
  ngOnChanges({ project }: SimpleChanges) {
    const n = Math.floor( Math.random() * 4 ) + 2;
    const assets = get( project, 'currentValue.assetElements.collection' );

    this.assets = assets || Array( 3 ).fill( '' );
    this.assetsCount = get( project, 'currentValue.assetElements.count' );
  }
}
