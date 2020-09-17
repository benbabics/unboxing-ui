import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { get } from 'lodash';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { map, delay, switchMap, finalize } from 'rxjs/operators';


@Injectable()
export class ProjectSlugValidator {

  isLoading$ = new BehaviorSubject<boolean>( false );
  
  constructor(
    private http: HttpClient,
  ) { }

  checkDuplicateValue(value: string): Observable<boolean> {
    this.isLoading$.next( true );
    return this._requestCheckDuplicate( value );
  }
  
  checkDuplicateControl(control: AbstractControl,): Observable<ValidationErrors | null> {
    this.isLoading$.next( true );
    return timer( 500 )
      .pipe(
        switchMap(() => this._requestCheckDuplicate( control.value )),
        map(isValid => isValid ? null : { "duplicateSlug": true }),
      );
  }

  private _requestCheckDuplicate(value: string): Observable<boolean> {
    let params = new HttpParams();
    params = params.append( 'isSlugUnique', value );
    
    return this.http.get<boolean>( `/api/projects`, { params } )
      .pipe(
        delay( 300 ),
        finalize(() => this.isLoading$.next( false )),
      );
  }
}
