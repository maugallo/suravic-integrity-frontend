import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonButton, IonInput, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { FormsModule, NgForm } from '@angular/forms';
import { UserRegisterRequest } from 'src/app/core/models/user.model';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [IonButton, IonContent, HeaderComponent, FormsModule, IonInput, IonSelect, IonSelectOption]
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

  ngOnInit() {}

  public onSubmit(userForm: NgForm) {

  }

}
