import { Injectable } from '@angular/core';
import { Carousel } from '../carousel/carousel';
import { AssetService } from '../../asset/asset.service';

@Injectable({
  providedIn: 'root'
})
export class CarouselPhotosService {

  private _instance: Carousel;

  get slide(): any {
    return this._instance.item;
  }
  get slidePrevious(): any {
    return this._instance.itemPrevious;
  }
  get slideNext(): any {
    return this._instance.itemNext;
  }
  get slideFirst(): any {
    return this._instance.itemFirst;
  }
  get slideLast(): any {
    return this._instance.itemLast;
  }
  
  constructor(
    asset: AssetService,
  ) {
    asset.photos$.subscribe(
      gallery => this._instance = new Carousel( gallery.dirIds )
    );
  }

  setBySlide(slide: any): void {
    this._instance.setBySlide( slide );
  }

  setBySlideId(galleryId: string): void {
    this._instance.setBySlideId( galleryId );
  }
}
