import { Component, OnInit } from '@angular/core';
import { IonContent, IonInput, IonNote, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.scss'],
  standalone: true,
  imports: [IonButton, IonNote, IonInput, IonContent, ]
})
export class ProviderFormComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
