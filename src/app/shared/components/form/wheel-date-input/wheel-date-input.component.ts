import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonDatetimeButton, IonModal, IonDatetime, IonButton, IonNote } from "@ionic/angular/standalone";
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
    selector: 'app-wheel-date-input',
    templateUrl: './wheel-date-input.component.html',
    styleUrls: ['./wheel-date-input.component.scss'],
    imports: [IonNote, IonButton, IonDatetime, IonModal, IonDatetimeButton, FormsModule],
standalone: true
})
export class WheelDateInputComponent extends BaseInputComponent {

  public today = new Date().toISOString().split('T')[0];

  public isDateValid(): boolean {
    return !!this.bindedObject;
  }

}
