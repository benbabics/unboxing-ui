import { Select, Store } from '@ngxs/store';
import { Component, HostBinding, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TreoMediaWatcherService } from '@treo/services/media-watcher';
import { TreoNavigationService } from '@treo/components/navigation';
import { Account, CurrentMembershipState, UiPreferences, UiPreferencesState, UiPreferencesNavigationAppearance, UiNavigationItem, UiState } from '@libCommon';

@Component({
  selector     : 'dense-layout',
  templateUrl  : './dense.component.html',
  styleUrls    : ['./dense.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DenseLayoutComponent implements OnInit, OnDestroy {
  
  data: any;
  isScreenSmall: boolean;
  hasToggledNavigation: boolean;
  
  @Select( CurrentMembershipState.account ) currentAccount$: Observable<Account>;
  @Select( UiState.navigationItems ) navigationItems$: Observable<UiNavigationItem[]>;
  @Select( UiPreferencesState.navigationAppearance ) navigationAppearance$: Observable<UiPreferencesNavigationAppearance>;

  @HostBinding( 'class.fixed-header' ) fixedHeader: boolean;
  @HostBinding( 'class.fixed-footer' ) fixedFooter: boolean;

  private _destroy$ = new Subject();

  constructor(
    private _store: Store,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _treoMediaWatcherService: TreoMediaWatcherService,
    private _treoNavigationService: TreoNavigationService
  ) {
    this.fixedHeader = false;
    this.fixedFooter = false;
    this.hasToggledNavigation = false;
  }
  
  get currentYear(): number {
    return new Date().getFullYear();
  }

  get currentUrl(): string {
    return this._router.url;
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
    const navigation = this._treoNavigationService.getComponent(key);
    if ( navigation ) navigation.toggle();
  }

  toggleNavigationAppearance(): void {
    this.hasToggledNavigation = true;
    this._store.dispatch(new UiPreferences.ToggleNavigationAppearance() );
  }
}
