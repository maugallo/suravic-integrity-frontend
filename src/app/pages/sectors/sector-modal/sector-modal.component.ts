import { Component } from '@angular/core';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonLabel, IonList, IonProgressBar, IonSearchbar } from "@ionic/angular/standalone";
import { SectorDashboardComponent } from "../sector-dashboard/sector-dashboard.component";
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

@Component({
  selector: 'app-sector-modal',
  templateUrl: './sector-modal.component.html',
  styleUrls: ['./sector-modal.component.scss'],
  standalone: true,
  imports: [IonSearchbar, IonProgressBar, IonList, IonLabel, IonContent, IonTitle, IonButton, IonButtons, IonToolbar, IonHeader, IonModal, HeaderComponent, SectorDashboardComponent]
})
export class SectorModalComponent {

  isInert = false;

  public setInert(value: boolean) {
    this.isInert = value;
  }

}
