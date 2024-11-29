import { Component, DestroyRef, inject, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from 'src/shared/components/back-button/back-button.component';
import { ValidationService } from 'src/shared/services/validation.service';
import { UserLoginRequest } from 'src/app/users/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TextInputComponent } from 'src/shared/components/form/text-input/text-input.component';
import { PasswordInputComponent } from 'src/shared/components/form/password-input/password-input.component';
import { SubmitButtonComponent } from 'src/shared/components/form/submit-button/submit-button.component';
import { AlertService } from 'src/shared/services/alert.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [IonContent, FormsModule, BackButtonComponent, TextInputComponent, PasswordInputComponent, SubmitButtonComponent]
})
export class LoginComponent {

  public router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private validationService = inject(ValidationService);

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
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => this.router.navigate(['tabs', 'home']),
      error: (error) => this.alertService.getErrorAlert(error.message).fire()
    });
  }

}
