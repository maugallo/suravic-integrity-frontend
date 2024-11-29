import { Component } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from 'src/shared/components/back-button/back-button.component';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    imports: [IonContent, BackButtonComponent]
})
export class ForgotPasswordComponent {

}
