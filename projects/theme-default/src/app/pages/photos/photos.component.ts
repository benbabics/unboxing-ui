import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  AssetDirectory,
  AssetElement,
  Slide,
  SlideState,
} from '@libCommon';
import { ImageLoaderComponent } from '@projects/theme-default/src/app/components';
import { AssetService } from '@projects/theme-default/src/app/services';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements AfterViewInit {

  @Select( SlideState.active ) slide$: Observable<Slide>;

  @ViewChildren( 'galleryImage' ) galleryImages: QueryList<ImageLoaderComponent>;

  hasLoaded: boolean = false;

  directoryIds: string[] = [];
  directories: AssetDirectory[] = [];
  photos: AssetElement[] = [];

  constructor(
    asset: AssetService,
  ) {
    asset.photos$.subscribe(gallery => {
      this.directoryIds = gallery.dirIds;
      this.directories  = gallery.directories;
      this.photos       = gallery.photos;
    });
  }

  ngAfterViewInit() {
    const listenOnLoad = images => Promise.all(
      images.map(img => img.preload())
    );

    if ( this.galleryImages.length ) {
      listenOnLoad( this.galleryImages )
        .then(() => this.hasLoaded = true);
    }
    else {
      setTimeout(() => this.hasLoaded = true);
      this.galleryImages.changes.subscribe(images => listenOnLoad( images ));
    }
  }
}
