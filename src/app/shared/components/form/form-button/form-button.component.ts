import { Component, input } from '@angular/core';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-form-button',
  templateUrl: './form-button.component.html',
  styleUrls: ['./form-button.component.scss'],
  standalone: true,
  imports: [IonButton, ]
})
export class FormButtonComponent {

  public label = input<string>('');
  public class = input<string>('');

}
