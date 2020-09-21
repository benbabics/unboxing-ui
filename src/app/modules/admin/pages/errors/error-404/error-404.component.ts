import { takeUntil, tap } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
    selector       : 'error-404',
    templateUrl    : './error-404.component.html',
    styleUrls      : ['./error-404.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Error404Component implements OnDestroy {

  private _destroy$ = new Subject();

  readonly defaultRedirectLabel = "Dashboard";
  readonly defaultRedirectUrl   = "/example";
  
  redirectLabel: string;
  redirectUrl: string;

  constructor(
    activatedRoute: ActivatedRoute,
  ) {
    activatedRoute.queryParams.pipe(
      takeUntil( this._destroy$ ),
      tap(({ redirectLabel }) => this.redirectLabel = redirectLabel),
      tap(({ redirectUrl }) => this.redirectUrl = redirectUrl),
    )
    .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }
}
