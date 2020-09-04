import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { SettingsFormComponent } from './../../components';

@Component({
  selector: 'app-settings-account',
  templateUrl: './settings-account.component.html',
  styleUrls: ['./settings-account.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsAccountComponent extends SettingsFormComponent {

  constructor(
    protected _store: Store,
  ) {
    super( _store );
  }

  protected _buildForm(): void {
    this.manageSettingsForm = new FormGroup({
      firstname: new FormControl(),
      lastname:  new FormControl(),
      email:     new FormControl(),
    });
  }
}
