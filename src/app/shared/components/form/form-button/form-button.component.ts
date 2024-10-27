import { Component, inject, input, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
  public disabled = input<boolean>(false);
  public icon = input<string>('');

  private sanitizer = inject(DomSanitizer);

  public sanitizeIcon(): string | null {
    return this.sanitizer.sanitize(SecurityContext.HTML, this.icon());
  }

}
