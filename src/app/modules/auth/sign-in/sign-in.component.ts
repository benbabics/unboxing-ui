import { catchError } from 'rxjs/operators';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TreoAnimations } from '@treo/animations';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: TreoAnimations
})
export class AuthSignInComponent implements OnInit {

  signInForm: FormGroup;
  message: any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {
    this.message = null;
  }

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      email:      [ '' ],
      password:   [ '' ],
      rememberMe: [ '' ],
    });
  }

  signIn(): void {
    this.signInForm.disable();
    this.message = null;

    const credentials = this.signInForm.value;
    this._authService.signIn( credentials )
      .toPromise()
      .catch(({ error }) => this.handleSigninFailure( error ));
  }

  private handleSigninFailure(error: any): void {
    this.signInForm.enable();

    this.message = {
      type:       'error',
      appearance: 'outline',
      content:    error,
      shake:      true,
      showIcon:   false,
    };
  }
}
