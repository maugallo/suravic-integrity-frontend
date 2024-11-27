import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-option-large',
  templateUrl: './option-large.component.html',
  styleUrls: ['./option-large.component.scss'],
  standalone: true,
  imports: [IonButton, ]
})
export class OptionLargeComponent {

  public label = input<string>();
  public icon = input<string>();

}
