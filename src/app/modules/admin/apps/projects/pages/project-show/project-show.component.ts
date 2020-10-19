import { Component, OnDestroy, OnInit } from '@angular/core';
import { TreoMediaWatcherService } from '@treo/services/media-watcher';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'project-show',
  templateUrl: './project-show.component.html',
  styleUrls: ['./project-show.component.scss']
})
export class ProjectShowComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  
  drawerOpened: boolean;
  drawerMode: 'over' | 'side';
  scrollMode: 'inner' | 'drawer-content';

  constructor(
    private _treoMediaWatcherService: TreoMediaWatcherService,
  ) {
    this.drawerOpened = true;
    this.drawerMode = 'side';
    this.scrollMode = 'inner';
  }

  ngOnInit() {
    this._treoMediaWatcherService.onMediaChange$
      .pipe( takeUntil(this._destroy$) )
      .subscribe(({ matchingAliases }) => {
        if (matchingAliases.includes('lt-lg')) {
          this.drawerOpened = false;
          this.drawerMode = 'over';
        }
        else {
          this.drawerOpened = true;
          this.drawerMode = 'side';
        }
      });
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }
}
