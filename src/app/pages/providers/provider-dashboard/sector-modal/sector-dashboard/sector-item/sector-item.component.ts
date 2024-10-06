import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { SectorRequest, SectorResponse } from 'src/app/core/models/sector.model';
import { SectorService } from 'src/app/core/services/sector.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sector-item',
  templateUrl: './sector-item.component.html',
  styleUrls: ['./sector-item.component.scss'],
  standalone: true,
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding,]
})
export class SectorItemComponent {

  private destroyRef = inject(DestroyRef);
  
  private sectorService = inject(SectorService);
  private alertService = inject(AlertService);

  public sector = input<SectorResponse>();

  public turnInert = output<boolean>(); // Necesario para que el input del sweet alert no tenga conflicto con el modal de Ionic.
  public refreshDashboard = output<void>(); // Avisa al modal que debe refrescarse.

  public updatedSector: SectorRequest = {
    name: ''
  }

  // Edit sector.
  public openEditSectorAlert() {
    this.turnInert.emit(true);

    this.alertService.getInputAlert('EDITAR RUBRO <i class="fa-solid fa-pen-to-square fa-1x"></i>', 'Ingrese un nombre', 'EDITAR', this.handleValidations(), this.sector()!.name)
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
      } else if (value !== this.sector()!.name) {
        this.updatedSector.name = value;
        return this.handleEdit();
      }
      return false;
    }
  }

  // Usamos firstValueFrom para obtener el primero (y único) valor que el observable devuelve, y transformarlo en una Promise.
  private handleEdit() {
    return firstValueFrom(this.sectorService.editSector(this.sector()!.id, this.updatedSector).pipe(
      tap((response) => {
        this.alertService.getSuccessToast(response).fire();
        this.refreshDashboard.emit();
      }),
      catchError((error) => {
        Swal.showValidationMessage(error.message);
        return of(null);
      })
    ));
  }

  // Delete sector.
  public openDeleteSectorAlert() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas eliminar el rubro?')
      .fire()
      .then((result: any) => {
        if (result.isConfirmed) {
          this.handleDelete();
        }
      });
  }

  private handleDelete() {
    this.sectorService.deleteOrRecoverSector(this.sector()!.id).pipe(
      tap((response) => {
        this.alertService.getSuccessToast(response).fire();
        this.refreshDashboard.emit();
      }),
      catchError((error) => {
        console.log(error);
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

}
