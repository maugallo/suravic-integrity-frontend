import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonButton, IonInput, IonSelect, IonSelectOption, IonNote } from "@ionic/angular/standalone";
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { UserRequest } from 'src/app/core/models/user.model';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EqualPasswordsDirective } from 'src/app/shared/validators/equal-passwords.directive';
import { UserService } from 'src/app/core/services/user.service';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AlertService } from 'src/app/core/services/utils/alert.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [IonNote, IonButton, IonContent, HeaderComponent, FormsModule, IonInput, IonSelect, IonSelectOption, EqualPasswordsDirective]
})
export class UserFormComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  public validationService = inject(ValidationService);
  private userService = inject(UserService);
  private alertService = inject(AlertService);

  public confirmPassword: string = '';
  public customInterfaceOptions: any = { cssClass: 'custom-select-options' } // Clase necesaria para customizar alert de options.

  public isUserEdit!: boolean;
  private userId!: number;
  
  public user: Signal<UserRequest | undefined> = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      const userId = params!.get('id');
      if (this.isParameterValid(userId)) {
        const user = this.userService.getUserById(Number(userId));
        if (!user) this.router.navigate(['providers', 'dashboard']);
        this.isUserEdit = true;
        this.userId = user.id;
        return of({
          username: user.username,
          password: '',
          role: user!.role
        })
      } else {
        this.isUserEdit = false;
        return of({
          username: '',
          password: '',
          role: ''
        });
      }
    })
  ));

  public onSubmit(userForm: NgForm) {
    if (!userForm.valid) {
      userForm.form.markAllAsTouched();
      return;
    }

    this.getFormOperation().pipe(
      tap((response) => this.handleSuccess(response)),
      catchError((error) => this.handleError(error)),
      takeUntilDestroyed(this.destroyRef)
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


  public isSelectNotValid(roleSelect: NgModel, selectedValue: string) {
    return (roleSelect && roleSelect.touched && !selectedValue);
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
