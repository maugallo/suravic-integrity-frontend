import { Component, inject } from '@angular/core';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonLabel, IonList, IonProgressBar, IonSearchbar } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../../shared/components/header/header.component";

@Component({
  selector: 'app-sector-dashboard',
  templateUrl: './sector-dashboard.component.html',
  styleUrls: ['./sector-dashboard.component.scss'],
  standalone: true,
  imports: [IonSearchbar, IonProgressBar, IonList, IonLabel, IonContent, IonTitle, IonButton, IonButtons, IonToolbar, IonHeader, IonModal, HeaderComponent]
})
export class SectorDashboardComponent {

  public searchForSectors(event: any) {

  }

}
