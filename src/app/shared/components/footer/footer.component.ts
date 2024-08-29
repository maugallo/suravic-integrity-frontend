import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonFooter, IonToolbar, IonTabButton, IonTabs, IonIcon, IonTabBar, IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonContent, IonTabBar, IonIcon, IonTabs, IonTabButton, IonFooter, IonToolbar,],
})
export class FooterComponent {

  router = inject(Router);

}
