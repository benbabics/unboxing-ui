import { Store } from '@ngxs/store';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CurrentUser, CurrentUserState } from 'app/data';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'user'
})
export class UserComponent implements OnInit, OnDestroy {

  private _destroy$: Subject<any> = new Subject();
  
  @Input() showAvatar: boolean = true;

  user: CurrentUser;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store,
    private router: Router,
  ) { }

  ngOnInit() {
    this.store.select( CurrentUserState.details )
      .pipe(
        takeUntil(this._destroy$),
        tap(user => this.user = user),
      )
      .subscribe(() => this.changeDetectorRef.detectChanges());
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  signOut(): void {
    this.router.navigate([ '/sign-out' ]);
  }
}
