import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonSearchbar, IonButton, IonList, IonProgressBar } from "@ionic/angular/standalone";
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.scss'],
  standalone: true,
  imports: [IonProgressBar, IonList, IonButton, IonSearchbar, IonContent, HeaderComponent]
})
export class ProviderDashboardComponent {

  public router = inject(Router);

  public searchForProviders(event: any) {

  }

}
