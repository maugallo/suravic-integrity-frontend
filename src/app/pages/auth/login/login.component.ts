import { Component, DestroyRef, inject, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from "../../../shared/components/back-button/back-button.component";
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { UserLoginRequest } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenService } from 'src/app/core/services/utils/token.service';
import { catchError, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from 'src/app/core/services/utils/session.service';
import { TextInputComponent } from "../../../shared/components/form/text-input/text-input.component";
import { PasswordInputComponent } from "../../../shared/components/form/password-input/password-input.component";
import { SubmitButtonComponent } from "../../../shared/components/form/submit-button/submit-button.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonContent, FormsModule, BackButtonComponent, TextInputComponent, PasswordInputComponent, SubmitButtonComponent]
})
export class LoginComponent {

  public router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private sessionService = inject(SessionService);
  public validationService = inject(ValidationService);

  public user: UserLoginRequest = {
    username: '',
    password: '',
  }

  @ViewChildren('loginInput') loginInputs!: QueryList<TextInputComponent | PasswordInputComponent>;

  public onSubmit() {
    if (!this.validationService.validateInputs(this.loginInputs)) {
      return;
    }

    this.handleLogin();
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
        this.loginInputs.forEach((loginInput) => loginInput.ionInput.control.setErrors({ loginError: error.message }))
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

}
