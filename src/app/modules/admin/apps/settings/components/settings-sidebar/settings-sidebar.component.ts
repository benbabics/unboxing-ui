import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { TreoNavigationItem } from '@treo/components/navigation/navigation.types';
import { SettingsState } from './../../states';

@Component({
  selector: 'settings-sidebar',
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsSidebarComponent implements OnDestroy {

  private _destroy$ = new Subject();
  
  menuData$: Observable<TreoNavigationItem[]>;

  constructor(store: Store) {
    this.menuData$ = store.select( SettingsState.navigationItems )
      .pipe( takeUntil(this._destroy$) );
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }
}
