import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonSearchbar, IonButton, IonList, IonProgressBar, IonModal, IonHeader, IonButtons, IonToolbar, IonTitle, IonItem, IonInput } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { SectorDashboardComponent } from "../sectors/sector-dashboard/sector-dashboard.component";

@Component({
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.scss'],
  standalone: true,
  imports: [IonInput, IonItem, IonTitle, IonToolbar, IonButtons, IonHeader, IonModal, IonProgressBar, IonList, IonButton, IonSearchbar, IonContent, HeaderComponent, SectorDashboardComponent]
})
export class ProviderDashboardComponent {

  public router = inject(Router);

  public searchForProviders(event: any) {

  }

}
