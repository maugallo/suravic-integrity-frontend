import { Component, inject, output } from '@angular/core';
import { IonButton, IonList, IonProgressBar } from "@ionic/angular/standalone";
import { SectorRequest } from '../../models/sector.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { SectorItemComponent } from './sector-item/sector-item.component';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { SectorStore } from '../../stores/sector.store';
import { ProviderStore } from 'src/app/modules/providers/stores/provider.store';
import { watchState } from '@ngrx/signals';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sector-dashboard',
  templateUrl: './sector-dashboard.component.html',
  styleUrls: ['./sector-dashboard.component.scss'],
  imports: [IonProgressBar, IonList, IonButton, HeaderComponent, NotFoundComponent, SectorItemComponent],
  standalone: true
})
export class SectorDashboardComponent {

  private alertService = inject(AlertService);
  private sectorStore = inject(SectorStore);
  private providerStore = inject(ProviderStore);

  public turnInert = output<boolean>(); // Necesario para que el input del sweet alert no tenga conflicto con el modal de Ionic.

  public sectors = this.sectorStore.enabledEntities();
  public sector: SectorRequest = { name: '' };

  constructor() {
    watchState(this.sectorStore, () => {
      if (this.sectorStore.success()) this.handleSuccess(this.sectorStore.message());
      if (this.sectorStore.error()) this.alertService.getErrorAlert(this.sectorStore.message());
    });
  }

  public openAddSectorAlert() {
    this.turnInert.emit(true);
    this.alertService.showInputAlert(
      'AGREGAR RUBRO <i class="fa-solid fa-grid-2-plus fa-1x"></i>', 'Ingrese un nombre',
      'AGREGAR', this.handleValidations()
    ).finally(() => this.turnInert.emit(false));
  }

  private handleValidations() {
    return (value: string) => {
      if (!value) {
        Swal.showValidationMessage("Este campo no puede estar vacío");
        return false;
      } else if (!value.match('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')) {
        Swal.showValidationMessage("Este campo solo acepta letras");
        return false;
      } else {
        this.sector.name = value;
        this.sectorStore.addEntity(this.sector);
        return true;
      }
    }
  }

  private handleSuccess(message: string) {
    if (message.includes('Modificado')) {
      this.providerStore.updateEntitiesBySector(this.sectorStore.lastUpdatedEntity()!);
    }
    this.alertService.getSuccessToast(message);
  }

}
