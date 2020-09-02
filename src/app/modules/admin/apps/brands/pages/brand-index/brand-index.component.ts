import { Select } from '@ngxs/store';
import { takeUntil, tap, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, Observable } from 'rxjs';
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

  private destroy$: Subject<any>;
  
  drawerMode: 'side' | 'over';
  contactsCount: number;

  @Select( BrandState.entities ) brands$: Observable<Brand[]>;

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild('dialogSaveChanges') dialogSaveChangesRef: TemplateRef<any>;
  
  constructor(
    public dialog: MatDialog,
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
        tap((drawerMode: any) => this.drawerMode = drawerMode),
        tap(() => this._changeDetectorRef.markForCheck()),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openDrawer(): void {
    this.matDrawer.open();
    this._changeDetectorRef.markForCheck();
  }

  openDialogSaveChanges(): Observable<boolean> {
    const dialogRef = this.dialog.open( this.dialogSaveChangesRef );
    return dialogRef.afterClosed();
  }

  closeDrawer(): void {
    this.matDrawer.close();
    this._changeDetectorRef.markForCheck();
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
