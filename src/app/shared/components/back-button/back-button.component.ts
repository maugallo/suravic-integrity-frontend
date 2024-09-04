import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { IonButton, IonAlert } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { addIcons } from "ionicons";

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: true,
  imports: [IonAlert, IonButton]
})
export class BackButtonComponent {

  location = inject(Location);
  router = inject(Router);

  class = input();
  isAlertOpen = false;

  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      cssClass: 'alert-button'
    },
    {
      text: 'Confirmar',
      role: 'confirm',
      cssClass: 'alert-button',
      handler: () => this.location.back()
    },
  ];

  public navigateBack() {
    if (this.location.path().includes('dashboard')) this.router.navigate(['tabs', 'home']);
    else if (this.location.path().includes('form')) this.setAlertOpen(true);
    else this.location.back();
  }

  public setAlertOpen(bool: boolean) {
    this.isAlertOpen = bool;
  }

}
