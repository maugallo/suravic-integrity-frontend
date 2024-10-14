import { Component, input } from '@angular/core';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss'],
  standalone: true,
  imports: [IonButton]
})
export class SubmitButtonComponent {

  public label = input<string>('Crear');
  public isEdit = input<boolean>(false);
  public class = input<string>('');
  public disabled = input<boolean>(false);

}
