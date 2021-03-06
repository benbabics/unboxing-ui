import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UiPreferences, UiPreferencesState, UiPreferencesThemeAppearance } from '@libCommon';
import { SettingsFormComponent } from './../../components';

@Component({
  selector: 'settings-ui',
  templateUrl: './settings-ui.component.html',
  styleUrls: ['./settings-ui.component.scss']
})
export class SettingsUiComponent extends SettingsFormComponent {

  constructor(
    protected _store: Store,
    private _snackBar: MatSnackBar,
  ) {
    super( _store );
  }

  protected _loadState(): Observable<UiPreferencesThemeAppearance> {
    return this._store.select( UiPreferencesState.themeAppearance );
  }

  protected _buildForm(theme?: UiPreferencesThemeAppearance): void {
    this.manageSettingsForm = new FormGroup({
      themeAppearance: new FormControl( theme ),
    });
  }

  handleSubmit(): void {
    const themeAppearance = this.manageSettingsForm.get( 'themeAppearance' ).value;
    this._store.dispatch( new UiPreferences.SetThemeAppearance(themeAppearance) )
      .toPromise()
      .then(() => this._snackBar.open('Settings for the user interface were updated successfully.', 'Ok'));
  }
}
