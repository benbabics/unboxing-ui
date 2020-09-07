import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { TreoMediaWatcherService } from '@treo/services/media-watcher/media-watcher.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'project-index',
  templateUrl: './project-index.component.html',
  styleUrls: ['./project-index.component.scss'],
})
export class ProjectIndexComponent implements OnInit, OnDestroy {

  @ViewChild('drawer') drawer: MatDrawer;

  drawerMode: 'over' | 'side';
  drawerOpened: boolean;

  private _destroy$ = new Subject();

  constructor(
    private _treoMediaWatcherService: TreoMediaWatcherService,
  ) {
    this.drawerMode = 'side';
    this.drawerOpened = true;
  }

  ngOnInit(): void {
    this._treoMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._destroy$))
      .subscribe(({ matchingAliases }) => {
        if (matchingAliases.includes('xs')) {
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
  }
}
