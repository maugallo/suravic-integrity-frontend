import { Component, DestroyRef, inject, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from 'src/app/shared/components/back-button/back-button.component';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { UserLoginRequest } from 'src/app/modules/users/models/user.model';
import { TextInputComponent } from 'src/app/shared/components/form/text-input/text-input.component';
import { PasswordInputComponent } from 'src/app/shared/components/form/password-input/password-input.component';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonContent, FormsModule, BackButtonComponent, TextInputComponent, PasswordInputComponent, SubmitButtonComponent],
  standalone: true
})
export class LoginComponent {

  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private validationService = inject(ValidationService);
  private destroyRef = inject(DestroyRef);
  public router = inject(Router);

  public user: UserLoginRequest = {
    username: '',
    password: '',
  }

  @ViewChildren('loginInput') loginInputs!: QueryList<TextInputComponent | PasswordInputComponent>;

  public onSubmit() {
    if (!this.validationService.validateInputs(this.loginInputs)) {
      return;
    }

    this.authService.login(this.user).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['tabs', 'home']),
        error: (error) => this.alertService.getErrorAlert(error.message)
      })
  }

}
