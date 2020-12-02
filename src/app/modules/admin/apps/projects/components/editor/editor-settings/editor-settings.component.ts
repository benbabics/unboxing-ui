import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'editor-settings',
  templateUrl: './editor-settings.component.html',
  styleUrls: ['./editor-settings.component.scss']
})
export class EditorSettingsComponent implements OnInit {

  settingsForm: FormGroup;

  @ViewChild( 'dialogUnpublish' ) private _dialogUnpublish: TemplateRef<any>;
  
  constructor(
    private _dialog: MatDialog,
  ) { }

  ngOnInit() {
    this._buildForm();
  }

  handleToggleAutoSave(): void {
    const control = this.settingsForm.controls.autoSave;
    control.setValue( !control.value );
  }

  handleTogglePublished(): void {
    const control   = this.settingsForm.controls.published;
    const published = !control.value;
    const confirm$  = published ? of({}) : this._dialogConfirmUnpublish();
    confirm$.subscribe(() => control.setValue( published ));
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
      published: new FormControl( false ),
      autoSave:  new FormControl( false ),
    });
  }
}
