import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';

@Component({
  selector: 'lib-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signupForm = new FormGroup({
    email:    new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ]),
  });
  
  constructor(
    private store: Store,
  ) { }

  handleSubmit() {
    if (this.signupForm.invalid) return;
    console.log(`store.dispatch( new Auth.Register(${JSON.stringify(this.signupForm.value)}) )`);
  }
}
