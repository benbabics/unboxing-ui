import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { get } from 'lodash';
import { Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { User, UserState } from '@libCommon';

@Component({
  selector: 'user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  
  @Input() user: User;
  @Input() userId: string;

  get userInitial(): string {
    return get( this.user, 'lastname', '?' ).charAt( 0 ).toUpperCase();
  }

  constructor(
    private _store: Store,
  ) { }

  ngOnInit() {
    this._store.select( UserState.entitiesMap )
      .pipe(
        takeUntil( this._destroy$ ),
        filter(() => !this.user),
        map(users => users[ this.userId ]),
      )
      .subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }
}
