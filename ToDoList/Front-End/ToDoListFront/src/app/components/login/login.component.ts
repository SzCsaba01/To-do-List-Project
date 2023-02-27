import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserLoginDetailsDto } from 'src/app/models/User/userLoginDetailsDto'; 
import { ErrorHandlerService } from 'src/app/services/error-handler.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginDetails?: UserLoginDetailsDto
  loginForm:FormGroup;

  constructor(
      public formBuilder: FormBuilder,
      public authenticationService: AuthenticationService,
      public route: Router,
      private errorService: ErrorHandlerService
  ) { 
    this.loginForm = this.formBuilder.group({
      userCredentials: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })

    if(authenticationService.isAuthenticated()){
      route.navigate(['home'])
    }
  }

  ngOnInit(): void { }

  public onLogin() {
    if (!this.errorService.checkLoginFields(this.loginForm.value)) {
      this.errorService.displayInvalidParameter(
        this.errorService.errorMessage
      );
      return;
    }
    this._loginSubscribe();
  }

  private _loginSubscribe() {
    this.authenticationService
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe(
        (_) => {
          this.route.navigate(['home']);
        },
        (error) => {
          this.errorService.handleError(error);
        }
      );
  }

  get userCredentials() { return this.loginForm.get('userCredentials')}

  get password() { return this.loginForm.get('password')}
}
