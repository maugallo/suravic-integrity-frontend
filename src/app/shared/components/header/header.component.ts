import { Component, input } from '@angular/core';
import { IonHeader, IonToolbar } from "@ionic/angular/standalone";
import { BackButtonComponent } from "../back-button/back-button.component";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [IonToolbar, IonHeader, BackButtonComponent],
    standalone: true
})
export class HeaderComponent {

  public icon = input();
  public title = input();
  public titleSize = input();
  public modalHeader = input(false);

}
