import { Component, inject, input, output } from '@angular/core';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { SectorRequest, SectorResponse } from 'src/app/modules/sectors/models/sector.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { SectorStore } from '../../../stores/sector.store';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sector-item',
  templateUrl: './sector-item.component.html',
  styleUrls: ['./sector-item.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding,],
  standalone: true
})
export class SectorItemComponent {

  private alertService = inject(AlertService);
  private sectorStore = inject(SectorStore);

  public turnInert = output<boolean>(); // Necesario para que el input del sweet alert no tenga conflicto con el modal de Ionic.
  public sector = input<SectorResponse>();

  public updatedSector: SectorRequest = { name: '' }

  public openEditSectorAlert() {
    this.turnInert.emit(true);
    this.alertService.showInputAlert(
      'EDITAR RUBRO <i class="fa-solid fa-pen-to-square fa-1x"></i>', 'Ingrese un nombre',
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
      } else if (value !== this.sector()!.name) {
        this.updatedSector.name = value;
        this.sectorStore.editEntity({ id: this.sector()!.id, entity: this.updatedSector });
        return true;
      }
      return false;
    }
  }

  public openDeleteSectorAlert() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas eliminar el rubro?')
      .then((result: any) => {
        if (result.isConfirmed) {
          this.sectorStore.deleteEntity(this.sector()!.id);
        }
      });
  }

}
