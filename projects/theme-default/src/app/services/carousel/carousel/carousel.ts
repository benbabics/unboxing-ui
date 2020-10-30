import { Carousel as CarouselHelper } from '@libCommon';

export class Carousel extends CarouselHelper {

  setBySlideId(galleryId: string): void {
    const slide = this.stack.find(({ directory }) => directory.id === galleryId);
    this.setBySlide( slide );
  }
  
  setBySlide(slide: any): void {
    const index = this.stack.indexOf( slide );
    if ( index >= 0 ) this._index = index;
  }
}
