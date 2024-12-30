import { Component } from '@angular/core';
import { IonModal, IonContent } from "@ionic/angular/standalone";
import { SectorDashboardComponent } from '../sector-dashboard/sector-dashboard.component';

@Component({
  selector: 'app-sector-modal',
  templateUrl: './sector-modal.component.html',
  styleUrls: ['./sector-modal.component.scss'],
  imports: [IonContent, IonModal, SectorDashboardComponent],
  standalone: true
})
export class SectorModalComponent {

  public isInert = false; // Propiedad necesaria para que los alert se puedan mostrar sobre el modal.

  public setInert(value: boolean) {
    this.isInert = value;
  }

}
