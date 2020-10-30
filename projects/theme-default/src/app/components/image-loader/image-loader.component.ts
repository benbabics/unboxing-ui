import { Component, AfterViewInit, Input, ChangeDetectorRef } from '@angular/core';
import { get } from 'lodash';

@Component({
  selector: 'image-loader',
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.scss']
})
export class ImageLoaderComponent implements AfterViewInit {

  private _promise: Promise<any>;

  hasLoaded: boolean = false;

  @Input() src: string;
  @Input() alt: string;

  constructor(
    private ref: ChangeDetectorRef,
  ) { }

  ngAfterViewInit() {
    this._promise = new Promise(resolve => {
      const img = new Image();
      img.src = this.src;
      img.onload  = () => resolve();
      img.onerror = () => resolve();
    })
    .finally(() => {
      this.hasLoaded = true;
      
      const isDestroyed = get( this.ref, 'destroyed' );
      !isDestroyed && this.ref.detectChanges();
    });
  }

  preload(): Promise<any> {
    return this._promise;
  }
}
