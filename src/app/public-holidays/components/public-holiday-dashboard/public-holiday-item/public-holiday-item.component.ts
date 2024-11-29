import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { PublicHolidayResponse } from 'src/app/core/models/interfaces/public-holiday.model';
import { PublicHolidayService } from 'src/app/core/services/public-holiday.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-public-holiday-item',
    templateUrl: './public-holiday-item.component.html',
    styleUrls: ['./public-holiday-item.component.scss'],
    imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, DatePipe]
})
export class PublicHolidayItemComponent {

  public router = inject(Router);

  private publicHolidayService = inject(PublicHolidayService);
  private alertService = inject(AlertService);

  public publicHoliday: any = input<PublicHolidayResponse>();

  public openDeletePublicHolidayAlert() {
    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas eliminar el feriado?`, 'Esta acción no se puede deshacer')
      .fire()
      .then((result) => { if (result.isConfirmed) this.deletePublicHoliday(this.publicHoliday().id) });
  }

  private deletePublicHoliday(id: number) {
    this.publicHolidayService.deletePublicHoliday(id).subscribe({
      next: (response) => this.alertService.getSuccessToast(response).fire(),
      error: (error) => this.alertService.getErrorAlert(error).fire()
    });
  }

}