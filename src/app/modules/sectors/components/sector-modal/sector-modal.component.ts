import { Component, inject, viewChild } from '@angular/core';
import { IonModal, IonContent } from "@ionic/angular/standalone";
import { SectorDashboardComponent } from '../sector-dashboard/sector-dashboard.component';
import { SectorStore } from '../../stores/sector.store';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'app-sector-modal',
  templateUrl: './sector-modal.component.html',
  styleUrls: ['./sector-modal.component.scss'],
  imports: [IonContent, IonModal, SectorDashboardComponent],
  standalone: true
})
export class SectorModalComponent {

  private sectorStore = inject(SectorStore);

  public isInert = false; // Propiedad necesaria para que los alert se puedan mostrar sobre el modal.
  public ionModal = viewChild(IonModal);

  constructor() {
    watchState(this.sectorStore, () => {
      if (this.sectorStore.success()) this.closeModal();
    });
  }

  public setInert(value: boolean) {
    this.isInert = value;
  }

  public closeModal() {
    this.ionModal()!.dismiss();
  }

}
