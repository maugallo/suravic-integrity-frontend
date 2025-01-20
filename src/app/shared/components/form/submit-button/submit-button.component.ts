import { Component, inject, input, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonButton } from "@ionic/angular/standalone";

@Component({
    selector: 'app-submit-button',
    templateUrl: './submit-button.component.html',
    styleUrls: ['./submit-button.component.scss'],
    imports: [IonButton],
standalone: true
})
export class SubmitButtonComponent {

  public label = input<string>('Crear');
  public icon = input<string>('');
  public isEdit = input<boolean>(false);
  public class = input<string>('');
  public disabled = input<boolean>(false);

}
