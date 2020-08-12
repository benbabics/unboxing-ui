import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any> {

  constructor(
    private _httpClient: HttpClient
  ) { }

  private _loadMessages(): Observable<any> {
    return this._httpClient.get('api/common/messages');
  }

  private _loadNavigation(): Observable<any> {
    return this._httpClient.get('api/common/navigation');
  }

  private _loadNotifications(): Observable<any> {
    return this._httpClient.get('api/common/notifications');
  }

  private _loadShortcuts(): Observable<any> {
    return this._httpClient.get('api/common/shortcuts');
  }

  private _loadUser(): Observable<any> {
    return this._httpClient.get('api/common/user');
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
      map((data) => {
        return {
          messages: data[0].messages,
          navigation: {
            compact:    data[1].compact,
            default:    data[1].default,
            futuristic: data[1].futuristic,
            horizontal: data[1].horizontal
          },
          notifications: data[2].notifications,
          shortcuts:     data[3].shortcuts,
          user:          data[4].user
        };
      })
    );
  }
}
