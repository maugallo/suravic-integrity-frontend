import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonInput, IonContent, IonIcon, IonButton } from "@ionic/angular/standalone";
import { BackButtonComponent } from "../../../shared/components/back-button/back-button.component";
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { UserLoginRequest } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenService } from 'src/app/core/services/utils/token.service';
import { catchError, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from 'src/app/core/services/utils/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonInput, FormsModule, RouterLink, BackButtonComponent]
})
export class LoginComponent {

  public router = inject(Router);
  private destroyRef = inject(DestroyRef);
  
  public validationService = inject(ValidationService);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private sessionService = inject(SessionService);

  public user: UserLoginRequest = {
    username: '',
    password: '',
  }

  @ViewChild('passwordInput', { static: false }) passwordInput!: NgModel;
  @ViewChild('usernameInput', { static: false }) usernameInput!: NgModel;

  public onSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      this.handleLogin();
    } else {
      loginForm.form.markAllAsTouched();
    }
  }

  private handleLogin() {
    this.authService.login(this.user).pipe(
      switchMap((response) => {
        const token: string = response.headers.get('Authorization')!;
        const userId: string = this.tokenService.getUserIdFromToken(token);
        this.sessionService.setUserId(userId);
        return this.tokenService.setToken(token).pipe(
          tap(() => this.router.navigate(['tabs', 'home']))
        )
      }),
      catchError((error) => {
        this.usernameInput.control.setErrors({ loginError: error.message });
        this.passwordInput.control.setErrors({ loginError: error.message });
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

}
