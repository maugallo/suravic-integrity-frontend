import { Component, inject, output } from '@angular/core';
import { IonButton, IonList, IonProgressBar } from "@ionic/angular/standalone";
import { SectorService } from 'src/app/core/services/sector.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { SectorRequest } from 'src/app/core/models/interfaces/sector.model';
import Swal from 'sweetalert2';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { SectorItemComponent } from "./sector-item/sector-item.component";
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';


@Component({
    selector: 'app-sector-dashboard',
    templateUrl: './sector-dashboard.component.html',
    styleUrls: ['./sector-dashboard.component.scss'],
    imports: [IonProgressBar, IonList, IonButton, HeaderComponent, NotFoundComponent, SectorItemComponent],
    standalone: true
})
export class SectorDashboardComponent {

  private sectorService = inject(SectorService);
  private alertService = inject(AlertService);

  public turnInert = output<boolean>(); // Necesario para que el input del sweet alert no tenga conflicto con el modal de Ionic.
  public sectors = this.sectorService.sectors;
  public sector: SectorRequest = { name: '' };

  public openAddSectorAlert() {
    this.turnInert.emit(true);
    this.alertService.getInputAlert('AGREGAR RUBRO <i class="fa-solid fa-grid-2-plus fa-1x"></i>', 'Ingrese un nombre', 'AGREGAR', this.handleValidations())
      .fire()
      .finally(() => this.turnInert.emit(false));
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
        return this.handleCreation();
      }
    }
  }

  // Usamos firstValueFrom para obtener el primero (y único) valor que el observable devuelve, y transformarlo en una Promise.
  private handleCreation() {
    return firstValueFrom(this.sectorService.createSector(this.sector).pipe(
      tap((response) => this.alertService.getSuccessToast(response).fire()),
      catchError((error) => {
        Swal.showValidationMessage(error.message);
        return of(null);
      })
    ));
  }

}
