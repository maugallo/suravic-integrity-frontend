import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DayOffResponse } from '../../../models/day-off.model';
import { DayOffService } from '../../../services/day-off.service';
import { AlertService } from 'src/shared/services/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-day-off-item',
    templateUrl: './day-off-item.component.html',
    styleUrls: ['./day-off-item.component.scss'],
    imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, DatePipe]
})
export class DayOffItemComponent {

  public router = inject(Router);

  private dayOffService = inject(DayOffService);
  private alertService = inject(AlertService);

  public dayOff: any = input<DayOffResponse>();

  public openDeleteDayOffAlert() {
    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas eliminar el feriado?`, 'Esta acción no se puede deshacer')
      .fire()
      .then((result) => { if (result.isConfirmed) this.deleteDayOff(this.dayOff().id) });
  }

  private deleteDayOff(id: number) {
    this.dayOffService.deleteDayOff(id).subscribe({
      next: (response) => this.alertService.getSuccessToast(response).fire(),
      error: (error) => this.alertService.getErrorAlert(error).fire()
    });
  }

}
