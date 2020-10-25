import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { fromPairs, toPairs } from 'lodash';
import { Auth } from '../../states';

@Component({
  selector: 'lib-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

  signinForm = new FormGroup({
    email:    new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ]),
  });

  constructor(
    private store: Store,
  ) { }

  handleSubmit() {
    if (this.signinForm.invalid) return;

    const credentials = this.signinForm.value;
    const value = fromPairs(toPairs(credentials).map(i => [ i[0] ]));
    
    this.store.dispatch([
      new Auth.Login(credentials),
      new UpdateFormValue({ value, path: 'signin.signinForm' }),
    ])
    .subscribe();
  }
}
