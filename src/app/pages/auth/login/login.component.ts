import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonInput, IonContent, IonIcon, IonButton } from "@ionic/angular/standalone";
import { BackButtonComponent } from "../../../shared/components/back-button/back-button.component";
import { ValidationService } from 'src/app/core/services/validation.service';
import { UserLoginRequest } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenService } from 'src/app/core/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonInput, FormsModule, RouterLink, BackButtonComponent]
})
export class LoginComponent {

  router = inject(Router);

  validationService = inject(ValidationService);
  authService = inject(AuthService);
  tokenService = inject(TokenService);

  @ViewChild('passwordInput', { static: false }) passwordInput!: NgModel;
  @ViewChild('usernameInput', { static: false }) usernameInput!: NgModel;

  user: UserLoginRequest = {
    username: '',
    password: '',
  }

  public onSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      this.handleLogin();
    } else {
      loginForm.form.markAllAsTouched();
    }
  }

  private handleLogin() {
    this.authService.login(this.user).subscribe({
      next: (response) => {
        const token: string = response.headers.get('Authorization')!;
        this.tokenService.setToken(token).subscribe({ complete: () => { this.router.navigate(['tabs/home']); } });
      },
      error: (error) => {
        this.usernameInput.control.setErrors({ loginError: error.message });
        this.passwordInput.control.setErrors({ loginError: error.message });
      }
    });
  }

}
