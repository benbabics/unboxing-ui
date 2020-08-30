import { takeUntil, tap, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { TreoMediaWatcherService } from '@treo/services/media-watcher/media-watcher.service';

@Component({
  selector: 'app-brands-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandsListComponent implements OnInit, OnDestroy {

  private destroy$: Subject<any>;
  
  drawerMode: 'side' | 'over';
  contactsCount: number;

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _treoMediaWatcherService: TreoMediaWatcherService,
  ) {
    this.destroy$ = new Subject();
    this.contactsCount = 3;
  }

  ngOnInit() {
    this._treoMediaWatcherService.onMediaQueryChange$( '(min-width: 1440px)' )
      .pipe(
        takeUntil( this.destroy$ ),
        map(({ matches }) => matches ? 'side' : 'over'),
        tap(drawerMode => console.log('* drawerMode', drawerMode)),
        tap((drawerMode: any) => this.drawerMode = drawerMode),
        tap(() => this._changeDetectorRef.markForCheck()),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToBrand(id: string): void {
    this._router.navigateByUrl( `/brands/${ id }` );
    this._changeDetectorRef.markForCheck();
  }

  handleClickBackdrop(): void {
    this._router.navigateByUrl( `/brands` );
    this._changeDetectorRef.markForCheck();
  }

  handleCreateBrand(): void {
    const id = `${ (new Date()).getTime() }`;
    this.navigateToBrand( id );
  }
}
