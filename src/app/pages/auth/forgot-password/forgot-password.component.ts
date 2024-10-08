import { Component } from '@angular/core';
import { IonButton, IonContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from "../../../shared/components/back-button/back-button.component";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [IonContent, IonButton, BackButtonComponent]
})
export class ForgotPasswordComponent {

}
