import { Component } from '@angular/core';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonLabel, IonList, IonProgressBar, IonSearchbar } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { SectorDashboardComponent } from "../sector-dashboard/sector-dashboard.component";

@Component({
  selector: 'app-sector-modal',
  templateUrl: './sector-modal.component.html',
  styleUrls: ['./sector-modal.component.scss'],
  standalone: true,
  imports: [IonSearchbar, IonProgressBar, IonList, IonLabel, IonContent, IonTitle, IonButton, IonButtons, IonToolbar, IonHeader, IonModal, HeaderComponent, SectorDashboardComponent]
})
export class SectorModalComponent {

}
