import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Slide, SlideState } from '@projects/lib-common/src/lib/states';
import { AssetService } from '@projects/theme-default/src/app/services';
import { Carousel } from '@projects/theme-default/src/app/services/carousel/carousel/carousel';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnDestroy {

  private _destroy$: Subject<boolean> = new Subject();
  carousel: Carousel;

  @Select( SlideState.active ) slide$: Observable<Slide>;

  constructor(
    asset: AssetService,
  ) {
    asset.videos$
      .pipe(
        takeUntil( this._destroy$ ),
        tap(videos => this.carousel = new Carousel( videos )),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.unsubscribe();
  }

  handlePreviousClick(): void {
    this.carousel.previous();
  }

  handleNextClick(): void {
    this.carousel.next();
  }

  handleSetSlide( slide ): void {
    this.carousel.setBySlide( slide );
  }
}
