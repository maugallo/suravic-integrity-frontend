import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { IonButton } from "@ionic/angular/standalone";
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: true,
  imports: [IonButton]
})
export class BackButtonComponent {

  location = inject(Location);
  router = inject(Router);

  class = input();

  public navigateBack() {
    if (this.location.path().includes('dashboard')) this.router.navigate(['tabs', 'home']);
    else this.location.back();
    /* REVISAR EN UN FUTURO, ALERTA PARA LOS FORMS QUE ESTÉN TOCADOS "¿Estás seguro que deseas volver?"
    if (this.location.path().includes('form')) ... */
  }

}
