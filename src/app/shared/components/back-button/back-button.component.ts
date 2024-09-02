import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: true,
  imports: [IonButton]
})
export class BackButtonComponent {

  location = inject(Location);

  class = input();

  public navigateBack() {
    this.location.back();
  }

}
