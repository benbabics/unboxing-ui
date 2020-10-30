import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { get, groupBy } from 'lodash';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AssetDirectory, AssetElement, AssetDirectoryState, AssetElementState, SlideState } from '@libCommon';

export type PhotoGallery = {
  dirIds: string[];
  directories: AssetDirectory[];
  photos: AssetElement[];
}

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private _photos$: BehaviorSubject<PhotoGallery> = new BehaviorSubject({
    dirIds: [],
    photos: [],
    directories: [],
  });
  private _videos$: BehaviorSubject<AssetElement[]> = new BehaviorSubject([]);

  get photos$(): Observable<PhotoGallery> {
    return this._photos$.asObservable();
  }
  get videos$(): Observable<AssetElement[]> {
    return this._videos$.asObservable();
  }
  
  constructor(
    private store: Store,
  ) {
    this.store.select( SlideState.active )
      .pipe(
        map(slide => ({
          photos: get( slide, 'attributes.galleries', [] ),
          videos: get( slide, 'attributes.trailers', [] ),
        })),
        tap(({ photos }) => this._photos$.next( this.mapPhotos(photos) )),
        tap(({ videos }) => this._videos$.next( this.mapVideos(videos) )),
      )
      .subscribe();
  }

  private mapPhotos(photoIds: string[]): any {
    const entitiesPhoto     = this.store.selectSnapshot( AssetElementState.entitiesMap );
    const entitiesDirectory = this.store.selectSnapshot( AssetDirectoryState.entitiesMap );
    
    const collectionPhotos = photoIds.map(id => entitiesPhoto[ id ]);
    const photos = groupBy( collectionPhotos, 'assetDirectoryId' );
    const dirIds = Object.keys( photos );
    const directories = Object.entries( photos ).reduce((json, [dirId]) => 
      ({ ...json, [ dirId ]: entitiesDirectory[ dirId ] }), {});

    return { photos, dirIds, directories };
  }

  private mapVideos(videoIds: string[]) {
    const entitiesVideo = this.store.selectSnapshot( AssetElementState.entitiesMap );
    return videoIds.map(id => entitiesVideo[ id ]);
  }
}
