import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  standalone: true,
  imports: [IonContent, IonButton, ]
})
export class OptionComponent {

  router = inject(Router);

  icon = input();
  label = input();
  url = input();

}
