import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDrawer } from '@angular/material/sidenav';
import { TreoMediaWatcherService } from '@treo/services/media-watcher/media-watcher.service';

@Component({
  selector: 'project-container',
  templateUrl: './project-container.component.html',
  styleUrls: ['./project-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectContainerComponent implements OnInit, OnDestroy {

  @ViewChild('drawer') drawer: MatDrawer;

  drawerMode: 'over' | 'side';
  drawerOpened: boolean;

  private _destroy$ = new Subject();

  constructor(
    private _treoMediaWatcherService: TreoMediaWatcherService,
  ) {
    this.drawerMode   = 'side';
    this.drawerOpened = true;
  }
  
  ngOnInit(): void {
    this._treoMediaWatcherService.onMediaChange$
      .pipe( takeUntil(this._destroy$) )
      .subscribe(({ matchingAliases }) => {
        if ( matchingAliases.includes('xs') ) {
          this.drawerMode   = 'over';
          this.drawerOpened = false;
        }
        else {
          this.drawerMode   = 'side';
          this.drawerOpened = true;
        }
      });
  }
  
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
