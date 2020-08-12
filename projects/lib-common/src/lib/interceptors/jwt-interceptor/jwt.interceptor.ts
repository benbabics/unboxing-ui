import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthState } from '../../states/auth/auth.state';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  
  get token(): string {
    return this.store.selectSnapshot(AuthState.token);
  }

  get isAuthenticated(): boolean {
    return this.store.selectSnapshot(AuthState.isAuthenticated);
  }
  
  constructor(private store: Store) { }
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isAuthenticated) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.token}`,
        }
      });
    }
    
    return next.handle(request);
  }
}
