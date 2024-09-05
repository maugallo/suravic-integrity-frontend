import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonInput, IonContent, IonIcon, IonButton } from "@ionic/angular/standalone";
import { BackButtonComponent } from "../../../shared/components/back-button/back-button.component";
import { ValidationService } from 'src/app/core/services/validation.service';
import { UserLoginRequest } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenService } from 'src/app/core/services/token.service';
import { catchError, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonInput, FormsModule, RouterLink, BackButtonComponent]
})
export class LoginComponent implements OnDestroy {

  router = inject(Router);

  validationService = inject(ValidationService);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);

  @ViewChild('passwordInput', { static: false }) passwordInput!: NgModel;
  @ViewChild('usernameInput', { static: false }) usernameInput!: NgModel;

  user: UserLoginRequest = {
    username: '',
    password: '',
  }

  private destroy$ = new Subject<void>();

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
        return this.tokenService.setToken(token).pipe(
          tap(() => this.router.navigate(['tabs', 'home']))
        )
      }),
      catchError((error) => {
        this.usernameInput.control.setErrors({ loginError: error.message });
        this.passwordInput.control.setErrors({ loginError: error.message });
        return of(null);
      }),
      takeUntil(this.destroy$) // Cuando destroy$ emite un valor, takeUntil se desuscribe del componente.
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emitimos un valor, avisando que hay que desuscribirse ya que el componente se destruirá.
    this.destroy$.complete(); // Marcamos el subject como complete.
  }

}
