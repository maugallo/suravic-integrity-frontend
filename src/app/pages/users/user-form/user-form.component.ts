import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonButton, IonInput, IonSelect, IonSelectOption, IonNote } from "@ionic/angular/standalone";
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { UserRegisterRequest } from 'src/app/core/models/user.model';
import { ValidationService } from 'src/app/core/services/validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EqualPasswordsDirective } from 'src/app/shared/validators/equal-passwords.directive';
import { UserService } from 'src/app/core/services/user.service';
import { addIcons } from "ionicons";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [IonNote, IonButton, IonContent, HeaderComponent, FormsModule, IonInput, IonSelect, IonSelectOption, EqualPasswordsDirective]
})
export class UserFormComponent  implements OnInit {

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  validationService = inject(ValidationService);
  userService = inject(UserService);

  user: UserRegisterRequest = {
    username: '',
    password: '',
    role: ''
  }
  confirmPassword: string = '';

  customInterfaceOptions: any = { cssClass: 'custom-select-options' } // Clase necesaria para customizar alert de options.

  @ViewChild('usernameInput', { static: false }) usernameInput!: NgModel;
  @ViewChild('passwordInput', { static: false }) passwordInput!: NgModel;
  @ViewChild('confirmPasswordInput', { static: false }) confirmPasswordInput!: NgModel;
  @ViewChild('roleSelect', { static: false }) roleSelect!: NgModel;

  ngOnInit() {
    this.handleUserForm();
  }

  ionViewWillEnter() {
    this.handleUserForm();
  }

  private handleUserForm() {
    if (this.areThereValidParams()) {
      this.userService.getUserById(this.getUrlParameter()).subscribe({
        next: (response) => {
          this.user.username = response.username;
          this.user.role = response.role;
        }
      })
    }
  }

  public onSubmit(userForm: NgForm) {
    if (userForm.valid) {
      if (this.areThereValidParams()) this.handleUserCreate();
      else this.handleUserEdit();
    } else {
      userForm.form.markAllAsTouched();
    }
  }

  private handleUserCreate() {
    this.userService.createUser(this.user).subscribe({
      next: (response) => {
        alert(response);
        this.router.navigate(['users', 'dashboard']);
      },
      error: (error) => {
        console.log(error.message);
      }
    })
  }

  private handleUserEdit() {
    this.userService.createUser(this.user).subscribe({
      next: (response) => {
        alert(response);
        this.router.navigate(['users', 'dashboard']);
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  public isSelectValid() {
    return (this.roleSelect && this.roleSelect.touched && this.user.role === '');
  }

  public areThereValidParams() {
    return !isNaN(this.getUrlParameter());
  }

  private getUrlParameter() {
    return Number(this.activatedRoute.snapshot.params['id']);
  }

}
