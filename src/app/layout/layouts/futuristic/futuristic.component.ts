import { Component, HostBinding, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { Account, CurrentMembershipState, UiNavigationItem, UiState } from '@libCommon';
import { TreoMediaWatcherService } from '@treo/services/media-watcher';
import { TreoNavigationService } from '@treo/components/navigation';

@Component({
  selector     : 'futuristic-layout',
  templateUrl  : './futuristic.component.html',
  styleUrls    : ['./futuristic.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FuturisticLayoutComponent implements OnInit, OnDestroy {

  data: any;
  isScreenSmall: boolean;

  @Select( CurrentMembershipState.account ) currentAccount$: Observable<Account>;
  @Select( UiState.navigationItems ) navigationItems$: Observable<UiNavigationItem[]>;
  
  @HostBinding( 'class.fixed-header' ) fixedHeader: boolean;
  @HostBinding( 'class.fixed-footer' ) fixedFooter: boolean;

  private _destroy$ = new Subject();

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _treoMediaWatcherService: TreoMediaWatcherService,
    private _treoNavigationService: TreoNavigationService
  ) {
    this.fixedHeader = false;
    this.fixedFooter = false;
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }
  
  ngOnInit(): void {
    this._activatedRoute.data
      .subscribe((data: Data) => this.data = data.initialData);

    this._treoMediaWatcherService.onMediaChange$
      .pipe( takeUntil(this._destroy$) )
      .subscribe(({ matchingAliases }) => {
        this.isScreenSmall = matchingAliases.includes( 'lt-md' );
      });
  }
  
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
  
  toggleNavigation(key): void {
    const navigation = this._treoNavigationService.getComponent( key );
    navigation?.toggle();
  }
}
