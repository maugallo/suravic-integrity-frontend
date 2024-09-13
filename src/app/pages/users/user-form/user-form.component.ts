import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonButton, IonInput, IonSelect, IonSelectOption, IonNote } from "@ionic/angular/standalone";
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { UserRequest } from 'src/app/core/models/user.model';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EqualPasswordsDirective } from 'src/app/shared/validators/equal-passwords.directive';
import { UserService } from 'src/app/core/services/user.service';
import { catchError, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from 'src/app/core/services/utils/alert.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [IonNote, IonButton, IonContent, HeaderComponent, FormsModule, IonInput, IonSelect, IonSelectOption, EqualPasswordsDirective]
})
export class UserFormComponent implements OnInit {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  public validationService = inject(ValidationService);
  private userService = inject(UserService);
  private alertService = inject(AlertService);

  public user: UserRequest = {
    username: '',
    password: '',
    role: ''
  }
  public confirmPassword: string = '';
  public customInterfaceOptions: any = { cssClass: 'custom-select-options' } // Clase necesaria para customizar alert de options.

  public isUserEdit!: boolean;
  private userId!: number;

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        const userId = params.get('id');
        if (this.isParameterValid(userId)) {
          return this.userService.getUserById(Number(userId)).pipe(
            tap((response) => {
              this.user.username = response.username;
              this.user.role = response.role;
              this.isUserEdit = true;
              this.userId = Number(userId);
            }),
            catchError((error) => {
              console.log(error.message);
              return of(null);
            })
          )
        } else {
          this.isUserEdit = false;
          return of(null);
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  public onSubmit(userForm: NgForm) {
    if (userForm.valid) {
      const operation$ = this.isUserEdit
      ? this.userService.editUser(this.userId, this.user)
      : this.userService.createUser(this.user);

      operation$.pipe(
        tap((response) => {
          this.alertService.getSuccessToast(response).fire();
          this.router.navigate(['users', 'dashboard']);
        }),
        catchError((error) => {
          this.alertService.getErrorAlert(error.message).fire();
          console.log(error.message);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();
    } else {
      userForm.form.markAllAsTouched();
    }
  }

  public isSelectNotValid(roleSelect: NgModel, selectedValue: string) {
    return (roleSelect && roleSelect.touched && !selectedValue);
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
