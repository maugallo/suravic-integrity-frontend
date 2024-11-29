import { Component, inject, QueryList, Signal, ViewChildren } from '@angular/core';
import { HeaderComponent } from 'src/shared/components/header/header.component';
import { IonContent, IonSelectOption } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { UserRequest } from '../../models/user.model';
import { ValidationService } from 'src/shared/services/validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AlertService } from 'src/shared/services/alert.service';
import { TextInputComponent } from 'src/shared/components/form/text-input/text-input.component';
import { NumberInputComponent } from 'src/shared/components/form/number-input/number-input.component';
import { SelectInputComponent } from 'src/shared/components/form/select-input/select-input.component';
import { PasswordInputComponent } from 'src/shared/components/form/password-input/password-input.component';
import { USER_ROLES, UserRole } from './user-roles.constant';
import { SubmitButtonComponent } from 'src/shared/components/form/submit-button/submit-button.component';
import { EntitiesUtility } from 'src/shared/utils/entities.utility';
import { UserMapper } from 'src/shared/mappers/user.mapper';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
    imports: [IonContent, HeaderComponent, FormsModule, IonSelectOption, TextInputComponent, PasswordInputComponent, SelectInputComponent, SubmitButtonComponent]
})
export class UserFormComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private userService = inject(UserService);
  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);

  public userRoles: UserRole[] = USER_ROLES;

  public confirmPassword: string = '';

  public isUserEdit!: boolean;
  public userId!: number;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent | NumberInputComponent | SelectInputComponent>;
  
  public user: Signal<UserRequest | undefined> = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      const userId = params!.get('id');
      if (this.isParameterValid(userId)) {
        const user = this.userService.getUserById(Number(userId));
        if (!user) this.router.navigate(['providers', 'dashboard']);
        this.isUserEdit = true;
        this.userId = user.id;
        return of(UserMapper.toUserRequest(user));
      } else {
        this.isUserEdit = false;
        return of(EntitiesUtility.getEmptyUserRequest());
      }
    })
  ));

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }
    
    this.getFormOperation().pipe(
      tap((response) => this.handleSuccess(response)),
      catchError((error) => this.handleError(error)),
    ).subscribe();
  }

  private getFormOperation(): Observable<any> {
    return this.isUserEdit
      ? this.userService.editUser(this.userId, this.user()!)
      : this.userService.createUser(this.user()!);
  }

  private handleSuccess(response: any) {
    this.alertService.getSuccessToast(response).fire();
    this.router.navigate(['users', 'dashboard']);
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message).fire();
    console.error(error.message);
    return of(null);
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
