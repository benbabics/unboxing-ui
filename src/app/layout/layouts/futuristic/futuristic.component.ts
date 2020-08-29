import { Component, HostBinding, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { CurrentAccount, CurrentAccountState, UiNavigationItem, UiState } from './../../../../../projects/lib-common/src/public-api';
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

  @Select( CurrentAccountState.details ) currentAccount$: Observable<CurrentAccount>;
  @Select( UiState.navigation ) navigation$: Observable<UiNavigationItem[]>;
  
  @HostBinding('class.fixed-header') fixedHeader: boolean;
  @HostBinding('class.fixed-footer') fixedFooter: boolean;

  private _destroy$: Subject<any>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private treoMediaWatcherService: TreoMediaWatcherService,
    private treoNavigationService: TreoNavigationService
  ) {
    this._destroy$ = new Subject();

    // Set the defaults
    this.fixedHeader = false;
    this.fixedFooter = false;
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }
  
  ngOnInit(): void {
    this.activatedRoute.data
      .subscribe((data: Data) => this.data = data.initialData);

    this.treoMediaWatcherService.onMediaChange$
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
    const navigation = this.treoNavigationService.getComponent( key );
    navigation?.toggle();
  }
}
