import { catchError, delay, map, tap } from 'rxjs/operators';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TreoAnimations } from '@treo/animations';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '@projects/lib-common/src/lib/states';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: TreoAnimations
})
export class AuthSignInComponent implements OnInit, AfterViewInit {

  @ViewChild( 'emailField' ) fieldEmail: ElementRef<any>;
  @ViewChild( 'passwordField' ) fieldPassword: ElementRef<any>;
  
  signInForm: FormGroup;
  message: any;

  constructor(
    private _store: Store,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
  ) {
    this.message = null;
  }

  ngOnInit(): void {
    this._store.selectOnce( AuthState.details )
      .subscribe(state => {
        this.signInForm = this._formBuilder.group({
          password:   [ '' ],
          email:      [ state.email ],
          rememberMe: [ state.rememberMe ],
        });
      });
  }

  ngAfterViewInit() {
    this._store.selectOnce( AuthState.details )
      .pipe(
        delay( 100 ),
        map(({ rememberMe }) => rememberMe ? this.fieldPassword : this.fieldEmail),
        tap(field => field.nativeElement.focus()),
      )
      .subscribe();
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
