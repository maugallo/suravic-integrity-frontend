import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonButton, IonInput, IonSelect, IonSelectOption, IonNote } from "@ionic/angular/standalone";
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { UserRegisterRequest } from 'src/app/core/models/user.model';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [IonNote, IonButton, IonContent, HeaderComponent, FormsModule, IonInput, IonSelect, IonSelectOption]
})
export class UserFormComponent  implements OnInit {

  validationService = inject(ValidationService);
  router = inject(Router);

  user: UserRegisterRequest = {
    username: '',
    password: '',
    role: ''
  }
  confirmPassword: string = '';

  @ViewChild('usernameInput', { static: false }) usernameInput!: NgModel;
  @ViewChild('passwordInput', { static: false }) passwordInput!: NgModel;
  @ViewChild('confirmPasswordInput', { static: false }) confirmPasswordInput!: NgModel;
  @ViewChild('roleSelect', { static: false }) roleSelect!: NgModel;

  customInterfaceOptions: any = { cssClass: 'custom-select-options' } // Clase necesaria para customizar alert de options.

  ngOnInit() {}

  public onSubmit(userForm: NgForm) {
    if (userForm.valid) {
      this.handleUserCreation();
    } else {
      userForm.form.markAllAsTouched();
    }
  }

  private handleUserCreation() {

  }

  public isSelectValid() {
    return (this.roleSelect && this.roleSelect.touched && this.user.role === '');
  }

}
