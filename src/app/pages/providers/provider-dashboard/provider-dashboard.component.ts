import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonSearchbar, IonButton, IonList, IonProgressBar, IonModal, IonHeader, IonButtons, IonToolbar, IonTitle, IonItem, IonInput } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { SectorModalComponent } from '../../sectors/sector-modal/sector-modal.component';

@Component({
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.scss'],
  standalone: true,
  imports: [IonInput, IonItem, IonTitle, IonToolbar, IonButtons, IonHeader, IonModal, IonProgressBar, IonList, IonButton, IonSearchbar, IonContent, HeaderComponent, SectorModalComponent]
})
export class ProviderDashboardComponent {

  public router = inject(Router);

  public searchForProviders(event: any) {

  }

}
