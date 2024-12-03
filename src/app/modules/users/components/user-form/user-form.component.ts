import { Component, computed, inject, QueryList, ViewChildren } from '@angular/core';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonSelectOption } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TextInputComponent } from 'src/app/shared/components/form/text-input/text-input.component';
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { PasswordInputComponent } from 'src/app/shared/components/form/password-input/password-input.component';
import { USER_ROLES, UserRole } from '../../models/user-roles.constant';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { EntitiesUtility } from 'src/app/shared/utils/entities.utility';
import { UserMapper } from 'src/app/shared/mappers/user.mapper';
import { UserStore } from '../../stores/user.store';
import { watchState } from '@ngrx/signals';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [IonContent, HeaderComponent, FormsModule, IonSelectOption, TextInputComponent, PasswordInputComponent, SelectInputComponent, SubmitButtonComponent],
  standalone: true
})
export class UserFormComponent {

  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);
  private userStore = inject(UserStore);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public userRoles: UserRole[] = USER_ROLES;

  public confirmPassword: string = '';

  public isUserEdit!: boolean;
  public userId!: number;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent | NumberInputComponent | SelectInputComponent>;

  constructor() {
    watchState(this.userStore, () => {
      if (this.userStore.success()) this.handleSuccess(this.userStore.message());
      if (this.userStore.error()) this.handleError(this.userStore.message());
    })
  }

  public idParam = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('id')) || 0))
  ));

  public user = computed(() => {
    const idParam = this.idParam()!;

    if (idParam !== 0) {
      const user = this.userStore.getUserById(idParam);
      this.isUserEdit = true;
      this.userId = user!.id;
      return UserMapper.toUserRequest(user!);
    } else {
      this.isUserEdit = false;
      return EntitiesUtility.getEmptyUserRequest();
    }
  });

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    if (this.isUserEdit) {
      this.userStore.editUser({ id: this.userId, user: this.user()! });
    } else {
      this.userStore.addUser(this.user()!);
    }
  }

  private handleSuccess(message: string) {
    this.alertService.getSuccessToast(message).fire();
    this.router.navigate(['users', 'dashboard']);
  }

  private handleError(message: string) {
    this.alertService.getErrorAlert(message).fire();
  }

}
