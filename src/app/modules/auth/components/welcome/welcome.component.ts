import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton } from "@ionic/angular/standalone";

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    imports: [IonButton, IonContent],
standalone: true
})
export class WelcomeComponent {

  public router = inject(Router);

}
