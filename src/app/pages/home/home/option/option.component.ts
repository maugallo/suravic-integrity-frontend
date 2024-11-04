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

  public router = inject(Router);

  public icon = input();
  public label = input();
  public url = input();
  public isForModal = input<boolean>(false);

  public navigate() {
    if (!this.isForModal()) {
      this.router.navigate([this.url()]);
    }
  }

}
