import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { ProjectActive, ProjectActiveState, UiPreferences, UiPreferencesState } from '@projects/lib-common/src/lib/states';
import { Observable, of, Subject } from 'rxjs';
import { filter, flatMap, publish, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'editor-settings',
  templateUrl: './editor-settings.component.html',
  styleUrls: ['./editor-settings.component.scss']
})
export class EditorSettingsComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  
  settingsForm: FormGroup;
  isProjectLoading: boolean = false;

  @ViewChild( 'dialogUnpublish' ) private _dialogUnpublish: TemplateRef<any>;

  constructor(
    private _store: Store,
    private _dialog: MatDialog,
  ) { }

  ngOnInit() {
    this._buildForm();

    this._store.select( ProjectActiveState.isLoading )
      .pipe(
        takeUntil( this._destroy$ ),
        tap(isLoading => this.isProjectLoading = isLoading),
      )
      .subscribe();

    this._store.select( ProjectActiveState.project )
      .pipe(
        takeUntil( this._destroy$ ),
        tap(({ published }: any) => this.settingsForm.controls.published.setValue( published )),
      )
      .subscribe();
    
    this._store.select( UiPreferencesState.projectSettingAutoSave )
      .pipe(
        takeUntil( this._destroy$ ),
        tap(autoSave => this.settingsForm.controls.autoSave.setValue( autoSave )),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  handleToggleAutoSave(): void {
    this._store.dispatch( new UiPreferences.ToggleProjectSettingAutoSave() );
  }

  handleTogglePublished(): void {
    const control   = this.settingsForm.controls.published;
    const published = !control.value;
    const confirm$  = published ? of({}) : this._dialogConfirmUnpublish();

    confirm$.pipe(
      take( 1 ),
      flatMap(() => this._store.dispatch( new ProjectActive.SetVisibilityStatus(published) )),
    )
      .subscribe();
  }

  private _dialogConfirmUnpublish(): Observable<any> {
    return this._openDialog( this._dialogUnpublish, {} )
      .pipe( filter(id => id === "SUBMIT") );
  }
  
  private _openDialog(tmplRef: TemplateRef<any>, data: any): Observable<any> {
    const dialogRef = this._dialog.open(tmplRef, { data, width: "400px" });
    return dialogRef.afterClosed().pipe( take( 1 ) );
  }
  
  private _buildForm(): void {
    this.settingsForm = new FormGroup({
      published: new FormControl(),
      autoSave:  new FormControl(),
    });
  }
}
