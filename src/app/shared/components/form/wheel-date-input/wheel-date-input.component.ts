import { Component, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonDatetimeButton, IonModal, IonDatetime, IonButton } from "@ionic/angular/standalone";
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-wheel-date-input',
  templateUrl: './wheel-date-input.component.html',
  styleUrls: ['./wheel-date-input.component.scss'],
  standalone: true,
  imports: [IonButton, IonDatetime, IonModal, IonDatetimeButton, FormsModule]
})
export class WheelDateInputComponent extends BaseInputComponent {

  public today = new Date().toISOString().split('T')[0];

}
