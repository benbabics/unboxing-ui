import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { TreoMediaWatcherService } from '@treo/services/media-watcher/media-watcher.service';
import { Settings } from './../../states';

@Component({
  selector: 'settings-container',
  templateUrl: './settings-container.component.html',
  styleUrls: ['./settings-container.component.scss']
})
export class SettingsContainerComponent implements OnInit, OnDestroy {

  drawerMode: 'over' | 'side';
  drawerOpened: boolean;

  private _destroy$ = new Subject();

  constructor(
    private _store: Store,
    private _treoMediaWatcherService: TreoMediaWatcherService,
  ) {
    this.drawerMode   = 'side';
    this.drawerOpened = true;
  }
  
  ngOnInit(): void {
    this._store.dispatch( new Settings.LoadNavigationItems() );

    this._treoMediaWatcherService.onMediaChange$
      .pipe( takeUntil(this._destroy$) )
      .subscribe(({ matchingAliases }) => {
        if ( matchingAliases.includes('lt-lg') ) {
          this.drawerMode = 'over';
          this.drawerOpened = false;
        }
        else {
          this.drawerMode = 'side';
          this.drawerOpened = true;
        }
      });
  }
  
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._store.dispatch( new Settings.ClearNavigationItems() );
  }
}
