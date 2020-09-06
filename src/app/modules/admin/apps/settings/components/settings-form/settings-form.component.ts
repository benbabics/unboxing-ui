import { tap, takeUntil } from 'rxjs/operators';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { UpdateFormDirty } from '@ngxs/form-plugin';
import { Subject, Observable, of } from 'rxjs';

@Component({
  selector: 'settings-form',
  template: '',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class SettingsFormComponent implements OnInit, OnDestroy {

  protected _destroy$ = new Subject();
  
  manageSettingsForm: FormGroup;

  constructor(
    protected _store: Store,
  ) { }

  ngOnInit(): void {
    this._loadState().pipe(
      takeUntil( this._destroy$ ),
      tap(state => this._buildForm( state )),
      tap(() => this._store.dispatch(new UpdateFormDirty({
        path:  "settings.manageSettingsForm",
        dirty: false,
      }))),
    )
    .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  protected _loadState(): Observable<any> {
    return of({ });
  }

  protected _buildForm(state?: any): void {
    this.manageSettingsForm = new FormGroup({ });
  }
}
