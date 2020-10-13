import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { TreoMockApi } from '@treo/lib/mock-api/mock-api.interfaces';
import { TreoMockApiService } from '@treo/lib/mock-api/mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectUserMockApi implements TreoMockApi {
  
  constructor(
    private _store: Store,
    private _http: HttpClient,
    private _authService: AuthService,
    private _treoMockApiService: TreoMockApiService,
  ) {
    this.register();
  }

  register(): void {
  }
}
