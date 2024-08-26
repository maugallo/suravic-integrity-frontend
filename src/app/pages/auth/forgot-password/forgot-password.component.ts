import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [IonContent, IonButton]
})
export class ForgotPasswordComponent {

  router = inject(Router);

}
