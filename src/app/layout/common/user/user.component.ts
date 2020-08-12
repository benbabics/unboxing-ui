import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'app/layout/common/user/user.types';
import { UserService } from 'app/layout/common/user/user.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'user'
})
export class UserComponent implements OnInit, OnDestroy {

  @Input() showAvatar: boolean = true;

  private _destroy$: Subject<any>;
  private _user: User;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _userService: UserService,
  ) {
    this._destroy$ = new Subject();
  }

  @Input()
  set user(value: User) {
    this._user = value;
    this._userService.user = value;
  }

  get user(): User {
    return this._user;
  }

  ngOnInit() {
    this._userService.user$
      .pipe(takeUntil(this._destroy$))
      .subscribe((user: User) => this._user = user);
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  updateUserStatus(status): void {
    this.user.status = status;
    this._userService.update(this.user);
  }

  signOut(): void {
    this._router.navigate(['/sign-out']);
  }
}
