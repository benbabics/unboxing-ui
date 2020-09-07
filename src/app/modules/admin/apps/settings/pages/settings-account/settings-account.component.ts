import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { CurrentUser, CurrentUserState } from './../../../../../../../../projects/lib-common/src/public-api';
import { SettingsFormComponent } from './../../components';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings-account',
  templateUrl: './settings-account.component.html',
  styleUrls: ['./settings-account.component.scss']
})
export class SettingsAccountComponent extends SettingsFormComponent {

  constructor(
    protected _store: Store,
    private _snackBar: MatSnackBar,
  ) {
    super( _store );
  }

  protected _loadState(): Observable<CurrentUser> {
    return this._store.select( CurrentUserState.details );
  }

  protected _buildForm(user?: CurrentUser): void {
    this.manageSettingsForm = new FormGroup({
      firstname: new FormControl( user?.firstname, [ Validators.required ] ),
      lastname:  new FormControl( user?.lastname,  [ Validators.required ] ),
      email:     new FormControl( user?.email,     [ Validators.required ] ),
    });
  }

  handleSubmit(): void {
    const user = this.manageSettingsForm.getRawValue();
    this._store.dispatch( new CurrentUser.Update(user) )
      .toPromise()
      .then(() => this._snackBar.open('Settings for the personal account were updated successfully.', 'Ok'));
  }
}
