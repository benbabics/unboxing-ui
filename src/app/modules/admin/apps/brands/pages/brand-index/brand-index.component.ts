import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap, map } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { ClearActive } from '@ngxs-labs/entity-state';
import { TreoMediaWatcherService } from '@treo/services/media-watcher/media-watcher.service';
import { Brand, BrandState } from './../../../../../../../../projects/lib-common/src/public-api';

@Component({
  selector: 'brand-index',
  templateUrl: './brand-index.component.html',
  styleUrls: ['./brand-index.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandIndexComponent implements OnInit, OnDestroy {

  private _destroy$: Subject<any>;
  
  drawerMode: 'side' | 'over';

  @Select( BrandState.sortedEntities ) brands$: Observable<Brand[]>;

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild('dialogSaveChanges') dialogSaveChangesRef: TemplateRef<any>;
  
  constructor(
    private _store: Store,
    private _router: Router,
    private _dialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
    private _treoMediaWatcherService: TreoMediaWatcherService,
  ) {
    this._destroy$ = new Subject();
  }

  ngOnInit() {
    this._treoMediaWatcherService.onMediaQueryChange$( '(min-width: 1440px)' )
      .pipe(
        takeUntil( this._destroy$ ),
        map(({ matches }) => matches ? 'side' : 'over'),
        tap((drawerMode: any) => this.drawerMode = drawerMode),
        tap(() => this._changeDetectorRef.markForCheck()),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  openDrawer(): void {
    this.matDrawer.open();
    this._changeDetectorRef.markForCheck();
  }

  closeDrawer(): void {
    this._store.dispatch( new ClearActive(BrandState) )
      .toPromise()
      .then(() => this.matDrawer.close())
      .then(() => this._changeDetectorRef.markForCheck());
  }

  openDialogSaveChanges(): Observable<boolean> {
    const dialogRef = this._dialog.open( this.dialogSaveChangesRef );
    return dialogRef.afterClosed();
  }

  navigateToBrand(id: string): void {
    this._router.navigateByUrl( `/brands/${ id }` );
    this._changeDetectorRef.markForCheck();
  }

  handleClickBackdrop(): void {
    this._router.navigateByUrl( `/brands` );
    this._changeDetectorRef.markForCheck();
  }
}
