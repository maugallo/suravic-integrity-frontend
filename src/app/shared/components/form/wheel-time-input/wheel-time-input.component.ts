import { Component } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';
import { IonDatetimeButton, IonButton, IonModal, IonDatetime, IonNote } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-wheel-time-input',
    templateUrl: './wheel-time-input.component.html',
    styleUrls: ['./wheel-time-input.component.scss'],
    imports: [IonNote, IonDatetime, IonModal, IonButton, IonDatetimeButton, FormsModule],
    standalone: true
})
export class WheelTimeInputComponent extends BaseInputComponent {

  

  public isDateValid(): boolean {
    return !!this.bindedObject;
  }

}
