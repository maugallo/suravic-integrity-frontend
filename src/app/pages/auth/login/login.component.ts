import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonInput, IonContent, IonIcon, IonButton } from "@ionic/angular/standalone";
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { BackButtonComponent } from "../../../shared/back-button/back-button.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonInput, FormsModule, RouterLink, BackButtonComponent]
})
export class LoginComponent implements OnInit {
  
  router = inject(Router);
  errorHandlerService = inject(ErrorHandlerService);

  path: String = '';

  user: any = {
    username: '',
    password: '',
    role: ''
  }

  ngOnInit(): void {
    this.path = this.getCurrentRoute();

    if (this.path === 'dueno-login') this.user.role = 'DUENO';
    if (this.path === 'encargado-login') this.user.role = 'ENCARGADO';

    

  }

  private getCurrentRoute() {
    const urlSegments = this.router.url.split('/');
    return urlSegments[urlSegments.length - 1];
  }

  public onSubmit(loginForm: NgForm) {
    if (loginForm.valid) {

    } else {
      loginForm.form.markAllAsTouched();
    }
  }

}
