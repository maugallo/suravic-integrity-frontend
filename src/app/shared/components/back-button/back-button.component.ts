import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { IonButton, IonAlert } from "@ionic/angular/standalone";
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: true,
  imports: [IonAlert, IonButton]
})
export class BackButtonComponent {

  private location = inject(Location);
  private router = inject(Router);

  public class = input();

  public isAlertOpen = false;
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
    else if (this.location.path().includes('form')) this.isAlertOpen =  true;
    else this.location.back();
  }

}
