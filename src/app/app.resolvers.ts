import { CurrentUserState } from './../../projects/lib-common/src/lib/states/current-user/current-user.state';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any> {

  constructor(
    private store: Store,
    private _httpClient: HttpClient,
  ) { }

  private _loadMessages(): Observable<any> {
    return this._httpClient.get('api/common/messages')
      .pipe(map(({ messages }: any) => messages));
  }

  private _loadNavigation(): Observable<any> {
    return this._httpClient.get('api/common/navigation')
      .pipe(map(navigation => navigation));
  }

  private _loadNotifications(): Observable<any> {
    return this._httpClient.get('api/common/notifications')
      .pipe(map(({ notifications }: any) => notifications));
  }

  private _loadShortcuts(): Observable<any> {
    return this._httpClient.get('api/common/shortcuts')
      .pipe(map(({ shortcuts }: any) => shortcuts));
  }

  private _loadUser(): Observable<any> {
    return this.store.selectOnce(CurrentUserState.details);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._loadMessages(),
      this._loadNavigation(),
      this._loadNotifications(),
      this._loadShortcuts(),
      this._loadUser()
    ])
    .pipe(
      map(([ messages, navigation, notifications, shortcuts, user, ]) => {
        return {
          messages,
          navigation,
          notifications,
          shortcuts,
          user,
        };
      })
    );
  }
}
