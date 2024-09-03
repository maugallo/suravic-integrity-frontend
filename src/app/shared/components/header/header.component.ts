import { Component, input, OnInit } from '@angular/core';
import { IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons } from "@ionic/angular/standalone";
import { BackButtonComponent } from "../back-button/back-button.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonButtons, IonBackButton, IonToolbar, IonTitle, IonHeader, BackButtonComponent]
})
export class HeaderComponent {

  icon = input();
  title = input();
  titleSize = input();

}
